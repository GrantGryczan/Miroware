function uninstall {
	schedule clear unlock_all_recipes:schedule
}
clock 5s {
	name schedule
	recipe give @a *
}
