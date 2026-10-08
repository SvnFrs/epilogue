# Button

Clay you press: it lifts on hover and sinks when pressed. `lamp` for the one primary action on a screen, `quill` for Finished, plain clay for everything else, `ghost` for dismissals, `danger` for removal.

**Provide** children (the label) and/or `icon`; icon-only buttons need `label` (their accessible name). `size`: `sm` (36px visual, 44px hit), `md` 44px, `lg` 52px. `round` makes a circle.

- One `lamp` per view. With the dock or rail showing, their + is it and everything else is clay. Inside a sheet (which covers the dock), the sheet's primary is the lamp. If two things feel primary, one of them is not.
- Labels are verbs with their object: "Log chapter 10", "Finished it", "Add to the margin". Not "Submit", not "OK".
- `danger` is text-only scorch; the filled scorch button appears only inside the delete confirmation.
