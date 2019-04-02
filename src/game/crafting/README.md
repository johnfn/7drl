Crafting code. Also will contain a standalone cli app to test out crafting system

# Agenda 
create a discovery-based procedurally-generated crafting system. Ingredients should come from hunting and gathering (think monster hunter), recipes can be either functional (e.g. minecraft) or flavorful (breath of the wild or don't starve cooking), crafting outcomes can have randomized effects (e.g. rogue's scrolls and potions)


## Inspirations

http://dwarffortresswiki.org/index.php/DF2014:Body_parts

https://monsterhunter.fandom.com/wiki/MH4U:_Monster_Material_List

https://en.wikipedia.org/wiki/Cut_of_beef

https://en.wikipedia.org/wiki/File:USDA_poultry_cuts.png

https://www.eurogamer.net/articles/2018-03-02-zelda-breath-of-the-wild-cooking-ingredients-list-bonus-effects-how-to-cook-with-the-cooking-pot-4857
( Bonus effects )

## TODO

* List of monsters, monster combinations, monster adjectives (owlbear? jawcrab? baby whalesquid? giant red hoofbeast?)
* Should their attacks be procedurally generated based on their name? e.g. poison? what other mechanics?
* List of parts
* Map of monster type to droppable parts
  - should monsters have special drops if defeated in certain ways? eg breakable horns? poison/fire interactions?
* Map of parts to part adjectives (thick, heavy, prime, gourmet, etc.)
* Map of part + adjective to description
  - Should parts start off unidentified? ("Some mysterious/unidentified <monster name> component/body part/organ") If so, do they become identified upon successfully using them?
* List of plants/gatherables and how to gather them (hand, shovel, bug net, pickaxe, tree climbing ability, other tools)
* Map of plants/gatherables to difficulty level
  - Are some raw ingredients usable as-is?
* Do raw ingredients take up pack space? If so, how can we make inventory management less painful?
* Map of parts to part classes (internal organ, membrane, rigid, semirigid, liquid, magical, tough, pretty)
* List of crafting result types (food, elixirs/potions, armor, weapons, misc. tools)
* Map of combinations of part classes to crafting result type
* Map of crafting result type and monster max/average difficulty to crafting result level? maybe just 1-1?
* For each crafting result type, map of crafting result level range to effect
* List of effects
* Note that crafting results should almost certainly start off unidentified/randomized appearance.


