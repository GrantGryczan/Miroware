tag @s add tpa.self
execute as @a[tag=tpa.sender] if score @s tpa.timeout > @a[tag=tpa.self,limit=1] tpa.timeout run tag @s remove tpa.sender
tag @s remove tpa.self