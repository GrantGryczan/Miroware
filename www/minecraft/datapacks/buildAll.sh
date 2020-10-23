cd directories
for directory in *; do
	cd "$directory"
	mcb -build -offline
	cd ..
done
