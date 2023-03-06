# Fibonacci Sequence 🐚

## Calculate the famous Fibonacci sequence

This is the scene we will be making today:

https://scratch.mit.edu/projects/812115282/


```scratchblocks
when green flag clicked
set [CanSpriteBeClicked v] to [no]
set [PreviousNumber v] to [0]
set [CurrentNumber v] to [1]
set [SequenceNumber v] to [1]
switch costume to (avery-b v)
think (join [Value ] (join (SequenceNumber) [of the Fibonacci sequence is...])) for [2] seconds
switch costume to (avery-a v)
say (join(PreviousNumber) [!]) for [2] seconds
say [Click me to continue the sequence!]

when this sprite clicked
if <(CanSpriteBeClicked) = [yes]> then
  change [SequenceNumber v] by [1]
  next costume
  say (join [Value ] (join (SequenceNumber) (join [of the Fibonacci sequence is...] (CurrentNumber))))
  set [TemporaryNumber v] to ((PreviousNumber) + (CurrentNumber))
  set [PreviousNumber v] to (CurrentNumber)
  set [CurrentNumber v] to (TemporaryNumber)
end
```
