if (!this.user) {
  this.redirect = "/login/?dest=/billing/";
  this.done();
  return;
}
if (!this.user.stripeCustomerId) {
  this.redirect = "/pricing/";
  this.done();
  return;
}
const session = await stripe.billingPortal.sessions.create({
  customer: this.user.stripeCustomerId,
  return_url: "https://filegarden.com/account/",
});
this.redirect = session.url;
this.done();
