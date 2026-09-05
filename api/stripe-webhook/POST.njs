let event;
try {
  event = stripe.webhooks.constructEvent(
    this.req.body,
    this.req.get("Stripe-Signature"),
    youKnow.stripe.webhookSigningSecret,
  );
} catch (error) {
  this.value = {
    error: "Invalid Stripe webhook.",
  };
  this.status = 400;
  this.done();
  return;
}

if (event.type === "checkout.session.completed") {
  if (!event.data.object.customer) {
    this.value = {
      error:
        "Missing 'checkout.session.completed' event's 'customer' field. This shouldn't currently be possible.",
    };
    this.status = 400;
    this.done();
    return;
  }

  if (!event.data.object.client_reference_id) {
    this.done();
    return;
  }

  const clientReferenceId = event.data.object.client_reference_id;
  const clientReferenceIdParts = clientReferenceId.split(" ");
  if (clientReferenceIdParts.length !== 2) {
    this.done();
    return;
  }

  let userId;
  try {
    userId = ObjectID(clientReferenceIdParts[0]);
  } catch (error) {
    this.done();
    return;
  }

  await users.updateOne(
    {
      _id: userId,
      stripeClientReferenceId: clientReferenceIdParts[1],
    },
    {
      $set: {
        stripeClientReferenceId: null,
        stripeCustomerId: event.data.object.customer,
      },
    },
  );
  this.done();
  return;
}

if (event.type === "entitlements.active_entitlement_summary.updated") {
  const entitlements = event.data.object.data;
  const storageTiers = entitlements
    .filter((entitlement) => entitlement.lookup_key.startsWith("storage-tier-"))
    .map((entitlement) => +entitlement.lookup_key.slice("storage-tier-".length))
    .sort();
  const storageTier = storageTiers[storageTiers.length - 1] ?? 0;

  await users.updateOne(
    {
      stripeCustomerId: event.data.object.customer,
    },
    {
      $set: {
        storageTier,
      },
    },
  );

  this.done();
  return;
}

this.value = {
  error: "Unsupported Stripe webhook event.",
};
this.status = 400;
this.done();
