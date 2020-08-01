function uninstall {
	schedule clear unlock_all_recipes:unlock_recipes
}
clock 5s {
	name unlock_recipes
	recipe give @a *
}
