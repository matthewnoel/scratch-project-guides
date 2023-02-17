# Math Quiz 🧮

## Make an addition quiz tool

[Play In Scratch](https://scratch.mit.edu/projects/805521735/)

```scratchblocks
when green flag clicked
forever
    set [a v] to (pick random [1] to [10])
    set [b v] to (pick random [1] to [10])
    ask (join [What is ] (join (a) (join [ + ] (join (b) [?])))) and wait
    if <(answer) = ((a) + (b))> then
        say [Great job!]
        wait (2) seconds
    else
        say (join [Not quite. It is ] ((a) + (b)))
        wait (2) seconds
    end
end
```