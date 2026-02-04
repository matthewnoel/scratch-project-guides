# Pong 🏓

## Make the classic game

https://scratch.mit.edu/projects/801064832

First we'll make a `Ball` sprite.
At the start it should go to the center then point in a random direction.
While the game is going it should move and bounce if it hits an edge.

```scratchblocks
when green flag clicked
go to x: (0) y: (0)
point in direction (pick random (-180) to (180))
forever
    move (5) steps
    if on edge, bounce
end
```

Next we'll make two sprites to be paddles.
The first sprite `Player` will be our player's paddle and it will move according to the mouse.
When the game starts we will put the paddle on the left side of the screen.
While the game is being played we will repeatedly set the paddle `y` position to the mouse's `y` position

```scratchblocks
when green flag clicked
set x to (-190)
forever
    set y to (mouse y)
end
```

The second sprite `Bot` will be our bot's paddle.
When the game start we will put the paddle on the right side of the screen.

```scratchblocks
when green flag clicked
go to x: (190) y: (0)
```

To help the bot follow the ball we will create a variable to track the ball's position.
This variable should exist for all sprites and we will set it to the ball's `y` position when the `Ball` sprite moves.

```scratchblocks
forever
    move (5) steps
    if on edge, bounce
    set [BallY v] to (y position)
end
```

The `Bot` sprite can then follow the `Ball` sprite like so.

```scratchblocks
when green flag clicked
go to x: (190) y: (0)
forever
    glide (0.2) secs to x: (190) y: (BallY)
end
```

We have a ball that bounces around the screen and paddles that move.
Next we need to make the ball bounce off the paddles.
Let's add a section in the `forever` block of our `Ball` sprite to point in the direction of a bounce if the ball touches either paddle.

```scratchblocks
forever
    move (5) steps
    if on edge, bounce
    set [BallY v] to (y position)
    if <<touching (Player v)?> or <touching (Bot v)?>> then
        point in direction ((direction) * (-1))
    end
end
```

Notice that nothing happens when a player misses the ball. Next we'll create two goal sprites called `Player Goal` and `Bot Goal` to help us determine when a player scores. Place the `Player Goal` sprite on the left side of the screen behind the `Player`. Make sure it covers the whole height of the screen, then do the same on the right side of the screen for the `Bot Goal` sprite.

We're also going to introduce two new variables called `Player Score` and `Bot Score`. Make sure they are checked in the block palette so that you can position the scores on screen for the players to see. Finally, we can add logic to the `Ball` sprite to increment the score when a player scores a goal. We will put it right after the section where we check if the ball is touching a player.

```scratchblocks
if <<touching (Player v)?> or <touching (Bot v)?>> then
    point in direction ((direction) * (-1))
end
if <touching (Player Goal v)?> then
    change [Bot Score v] by (1)
end
if <touching (Bot Goal v)?> then
    change [Player Score v] by (1)
end
```

Press the green flag to play the game and notice what happens when either player scores a goal. The score goes up by more than 1! That is because the `forever` loop is repeating multiple times while the ball is still touching the goal. We can fix this by resetting the ball to the center of the screen once someone has scored a point.