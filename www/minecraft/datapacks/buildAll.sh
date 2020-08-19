cd directories
for directory in *; do
	cd "$directory"
	mcb -build
	cd ..
done
