The navigation logic should satisfy these constraints:

* Passengers should be able to press an outside button to summon the elevator to stop at their floor and an inside button to be taken to the specified floor.
* A passenger who presses an outside button that is compatible with the elevator's current direction (e.g. floor 4 going up when the elevator is at floor 3 traveling upwards) should be picked up without being passed by the elevator.
* A passenger who presses an outside button that is NOT compatible with the elevator's current direction (e.g. floor 4 going down when the elevator is at floor 3 traveling upwards) should be picked up after all requests that are compatible with the elevator's current direction are fulfilled.
* A passenger who presses an inside button that is compatible with the elevator’s current direction (e.g. floor 6 when the elevator is at floor 3 traveling upwards) should be taken to that floor without experiencing a change in the elevator’s direction.
* A passenger who presses an inside button that is NOT compatible with the elevator’s current direction (e.g. floor 6 when the elevator is at floor 3 traveling downwards) should be taken to the requested floor after all requests that are compatible with the elevator’s current direction are fulfilled.
* Model the elevator as taking 5 seconds to go from one floor to the next and 10 seconds to make a stop at a floor.
