function rectCollision({rect1, rect2})
{
  return(
    rect1.attackBox.position.x + rect1.attackBox.width > rect2.position.x          && rect1.attackBox.position.x <= rect2.position.x + rect2.width && 
    rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y
    && rect1.attackBox.position.y <= rect2.position.y + rect2.height
  )
}

function determineWin({player, enemy, timerId})
{
  clearTimeout(timerId)
  document.querySelector("#txtendGame").style.display = "flex"
  if (player.health === enemy.health)
    {
      document.querySelector("#txtendGame").innerHTML = "Tie"
    }
    else if (player.health > enemy.health)
    {
      document.querySelector("#txtendGame").innerHTML = "Player 1 wins"
    }
    else
    {
      document.querySelector("#txtendGame").innerHTML = "Player 2 wins"
    }
}

let timer = 60
let timerId
function decreaseTime() 
{
  if (!isPaused) 
  {
    if (timer > 0) 
    {
      timer--
      document.querySelector("#timer").innerHTML = timer
      timerId = setTimeout(decreaseTime, 1000)
    } 
    else 
    {
      determineWin({ player, enemy, timerId })
    }
  } 
  else 
  {
    timerId = setTimeout(decreaseTime, 1000) // Keep calling                                 decreaseTime to check the pause state
  }
}
