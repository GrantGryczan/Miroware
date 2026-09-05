if (this.user?.stripeCustomerId) {
	const entitlements = await stripe.entitlements.activeEntitlements.list({
		customer: this.user.stripeCustomerId,
	});

	const storageTiers = entitlements
		.filter((entitlement) => entitlement.lookup_key.startsWith("storage-tier-"))
		.map((entitlement) => +entitlement.lookup_key.slice("storage-tier-".length))
		.sort();
	const storageTier = storageTiers[storageTiers.length - 1] ?? 0;

	if (storageTier !== this.user.storageTier) {
		await users.updateOne(
			{
				stripeCustomerId: this.user.stripeCustomerId,
			},
			{
				$set: {
					storageTier,
				},
			},
		);
	}
}

this.title = "Payment Successful";
this.value = (await load("load/head", this)).value;
this.value += html`
		<style>main{text-align:center;}</style>`;
this.value += (await load("load/body", this)).value;
this.value += (await load("load/pagehead", this)).value;
this.value += html`
				<p>Thanks for supporting File Garden; it helps a lot! :)</p>
				<div>
					<a class="mdc-button mdc-button--raised mdc-ripple" href="${this.user ? `/users/${this.user._id}/garden/#` : "/login/?dest=%2F"}">Visit Your Garden</a>
				</div>`;
this.value += (await load("load/pagefoot", this)).value;
this.value += (await load("load/belt", this)).value;
this.value += (await load("load/foot", this)).value;
this.done();
