# Fibonacci Sequence 🐚

## Calculate the famous Fibonacci sequence

The Fibonacci sequence is a series of numbers which looks like this:

`0, 1, 1, 2, 3, 5, 8, 13 ...`

It starts with `0` and `1` and it continues forever. The next number is always the result of adding the two previous numbers.

`0 + 1 = 1`

`1 + 1 = 2`

`1 + 2 = 3`

`2 + 3 = 5`

`...`

[Learn more about the Fibonacci sequence.](https://www.mathsisfun.com/numbers/fibonacci-sequence.html)

Can you write a scratch program that calculates the Fibonacci sequence?

https://scratch.mit.edu/projects/812115282/

## Solution

To start we'll create two variables to represent the numbers which start the sequence.

```scratchblocks
when green flag clicked
set [PreviousNumber v] to [0]
set [CurrentNumber v] to [1]
```

We'll calculate the next number in the sequence when our sprite is clicked.

```scratchblocks
when this sprite clicked
set [TemporaryNumber v] to ((PreviousNumber) + (CurrentNumber))
set [PreviousNumber v] to (CurrentNumber)
set [CurrentNumber v] to (TemporaryNumber)
```

Next let's make our character say each number and its place in the sequence.

```scratchblocks
when green flag clicked
set [PreviousNumber v] to [0]
set [CurrentNumber v] to [1]
set [SequenceNumber v] to [1]
think (join [Value ] (join (SequenceNumber) [of the Fibonacci sequence is...])) for [2] seconds
say (join(PreviousNumber) [!]) for [2] seconds
say [Click me to continue the sequence!]
when this sprite clicked
change [SequenceNumber v] by [1]
say (join [Value ] (join (SequenceNumber) (join [of the Fibonacci sequence is...] (CurrentNumber))))
set [TemporaryNumber v] to ((PreviousNumber) + (CurrentNumber))
set [PreviousNumber v] to (CurrentNumber)
set [CurrentNumber v] to (TemporaryNumber)
```

We can add costume changes to make our sprite move.
Finally we'll use an `if` block to make sure the sprite can't be clicked before it is ready.

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

The project is complete. Good job!
