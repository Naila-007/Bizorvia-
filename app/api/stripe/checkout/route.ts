import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const PLANS: Record<string, { name: string; price: number; description: string }> = {
  builder:  { name: "Builder",  price: 3900,  description: "Perfect for solo founders" },
  business: { name: "Business", price: 12900, description: "For growing businesses" },
  scale:    { name: "Scale",    price: 39900, description: "For scaling enterprises" },
};

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

    const { plan } = await req.json();
    const planConfig = PLANS[plan];
    if (!planConfig) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

    // Lazy Stripe init — only runs when API key is available at runtime
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: user.email,
      metadata: { userId: user.id, plan },
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: `Bizorvia ${planConfig.name}`, description: planConfig.description },
          unit_amount: planConfig.price,
          recurring: { interval: "month" },
        },
        quantity: 1,
      }],
      success_url: `https://bizorvia.com/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://bizorvia.com/pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
