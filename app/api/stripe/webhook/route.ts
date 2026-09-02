import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    if (event.type === "checkout.session.completed") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const session = event.data.object as any;
      const userId = session?.metadata?.userId;
      const plan = session?.metadata?.plan;
      if (userId && plan) {
        await supabase.from("profiles").update({
          plan,
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription,
        }).eq("id", userId);
      }
    }

    if (event.type === "customer.subscription.deleted") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sub = event.data.object as any;
      await supabase.from("profiles")
        .update({ plan: "free", stripe_subscription_id: null })
        .eq("stripe_customer_id", sub.customer);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 400 });
  }
}
