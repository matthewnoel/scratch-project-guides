# Math Quiz 🧮

## Make an addition quiz tool

https://scratch.mit.edu/projects/805521735/

In this project we will create a game where the player is quizzed on their addition facts.

We will start by creating two variables. `FirstNumber` will stand for our first number and `SecondNumber` will stand for our second number. When our game begins we will set each of them to a random number between 1 and 10.

```scratchblocks
when green flag clicked
set [FirstNumber v] to (pick random [1] to [10])
set [SecondNumber v] to (pick random [1] to [10])
```

Then we need to ask the player what they think the answer is. We can do this using the `ask` block.

```scratchblocks
ask (join [What is ] (join (FirstNumber) (join [ + ] (join (SecondNumber) [?])))) and wait
```

Next we'll handle figuring out if the player's `answer` is correct. If they are, we'll say "Great job!". If they aren't, we'll tell them what the correct answer was.

```scratchblocks
if <(answer) = ((FirstNumber) + (SecondNumber))> then
    say [Great job!]
    wait (2) seconds
else
    say (join [Not quite. It is ] ((FirstNumber) + (SecondNumber)))
    wait (2) seconds
end
```

Finally we can wrap the whole thing in a `forever` block to keep the game going!

```scratchblocks
when green flag clicked
forever
    set [FirstNumber v] to (pick random [1] to [10])
    set [SecondNumber v] to (pick random [1] to [10])
    ask (join [What is ] (join (FirstNumber) (join [ + ] (join (SecondNumber) [?])))) and wait
    if <(answer) = ((FirstNumber) + (SecondNumber))> then
        say [Great job!]
        wait (2) seconds
    else
        say (join [Not quite. It is ] ((FirstNumber) + (SecondNumber)))
        wait (2) seconds
    end
end
```

Going Further 🚀

- How would this game work adding three numbers?
- How would you make this game work for subtraction?
- How would you let the player try again if they were wrong instead of telling them the answer?