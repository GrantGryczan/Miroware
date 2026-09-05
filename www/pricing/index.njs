if (!this.user) {
	this.redirect = "/login/?dest=/pricing/";
	this.done();
	return;
}
this.title = "Pricing";
this.description = "Support File Garden and get more storage!";
this.tags = ["filegarden", "garden", "file", "files", "more", "increase", "storage", "space", "pricing", "support", "supporter", "plans", "plan", "cost", "costs", "paid", "tier", "tiers", "subscription", "subscriptions"];
this.value = (await load("load/head", this)).value;
this.value += html`
		<style>main{text-align:center;}</style>`;
this.value += (await load("load/body", this)).value;
this.value += (await load("load/pagehead", this)).value;
this.value += html`
				<p>I pay hosting costs out of pocket, and it's not cheap. Please support us and get more storage!</p>`;
if (this.user.stripeCustomerId) {
	const customerSession = await stripe.customerSessions.create({
		customer: this.user.stripeCustomerId,
		components: { pricing_table: { enabled: true } },
	});
	this.value += html`
			<script async src="https://js.stripe.com/v3/pricing-table.js"></script>
			<stripe-pricing-table
				pricing-table-id="prctbl_1UC4zNB0vvlrZrIaCNKU5NAA"
				publishable-key="pk_test_51UAg9GB0vvlrZrIa8345vgJxAphjxKkeC6YL6T0p4pDvlx1TLEHgb3MMHm48rmXr8LBWvNCjpr9OVjN3UQ0sirrM007qc8Mlhc"
				customer-session-client-secret="$${customerSession.client_secret}"
			></stripe-pricing-table>`;
} else {
	let stripeClientReferenceId = this.user.stripeClientReferenceId;
	if (!stripeClientReferenceId) {
		stripeClientReferenceId = crypto.randomBytes(24).toString("base64");
		await users.updateOne({ _id: this.user._id }, {
			$set: { stripeClientReferenceId },
		});
	}
	this.value += html`
				<script async src="https://js.stripe.com/v3/pricing-table.js"></script>
				<stripe-pricing-table
					pricing-table-id="prctbl_1UC4zNB0vvlrZrIaCNKU5NAA"
					publishable-key="pk_test_51UAg9GB0vvlrZrIa8345vgJxAphjxKkeC6YL6T0p4pDvlx1TLEHgb3MMHm48rmXr8LBWvNCjpr9OVjN3UQ0sirrM007qc8Mlhc"
					customer-email="$${this.user.email}"
					client-reference-id="$${this.user._id.toString("hex") + ":" + stripeClientReferenceId}"
				></stripe-pricing-table>`;
}
this.value += (await load("load/pagefoot", this)).value;
this.value += (await load("load/belt", this)).value;
this.value += (await load("load/foot", this)).value;
this.done();
