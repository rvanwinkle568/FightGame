const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite
(
  {
    position: 
    {
      x: 0,
      y:0
    },

    imageSrc: "./assets/background.png"
  }
)

const shop = new Sprite
(
  {
    position: 
    {
      x: 600,
      y:128
    },

    imageSrc: "./assets/shop.png",
    scale: 2.75,
    framesMax: 6
  }
)

const player = new Fighter
(
  {
    position:{
      x: 0,
      y: 0
    },
    velocity:
    {
      x: 0,
      y:0
    },
    offset:
    {
      x: 0,
      y: 0
    },
    imageSrc: "./assets/samuraiMack/Idle.png",
    framesMax: 8,
    scale: 2.5,
    offset: 
    {
      x: 215,
      y: 157
    },
    sprites: 
    {
      idle: 
      {
        imageSrc: "./assets/samuraiMack/Idle.png",
        framesMax: 8
      },
      run: 
      {
        imageSrc: "./assets/samuraiMack/Run.png",
        framesMax: 8
      },
      jump: 
      {
        imageSrc: "./assets/samuraiMack/Jump.png",
        framesMax: 2
      }
    }
  }
)


const enemy = new Fighter
(
  {
    position:{
      x: 400,
      y: 100
    },
    velocity:
    {
      x: 0,
      y:0
    },
    color: "blue",
    offset:
    {
      x: -50,
      y: 0
    }
  }
)

console.log(player)

const keys = 
{
  a: 
  {
    pressed: false
  },
  d: 
  {
    pressed: false
  },
  w:
  {
    pressed: false
  },
  ArrowRight:
  {
    pressed: false
  },
  ArrowLeft:
  {
    pressed: false
  }
}

decreaseTime()

function animate()
{
  window.requestAnimationFrame(animate)
  c.fillStyle = "black"
  c.fillRect(0, 0, canvas.width, canvas.height)
  background.update()
  shop.update()
  player.update()
  //enemy.update()
  
  //Player movement
  player.velocity.x = 0
  if (keys.a.pressed && player.lastKey === "a")
  {
    player.velocity.x = -5
    player.switchSprite("run")
  }
  else if (keys.d.pressed && player.lastKey === "d")
  {
    player.velocity.x = 5
    player.switchSprite("run")
  }
  else
  {
    player.switchSprite("idle")
  }

  if (player.velocity.y < 0)
  {
    player.switchSprite("jump")
  }

  //Enemy movement
  enemy.velocity.x = 0
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft")
  {
    enemy.velocity.x = -5
  }
  else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight")
  {
    enemy.velocity.x = 5 
  }

  //Detect for collision
  if ( rectCollision({rect1: player, rect2: enemy}) && player.isAttacking)
  {
    player.isAttacking = false
    enemy.health -= 20
    document.querySelector("#enemyHealth").style.width = enemy.health + "%"
  }

  if ( rectCollision({rect1: enemy, rect2: player}) && enemy.isAttacking)
    {
      player.health -= 20
      enemy.isAttacking = false
      document.querySelector("#playerHealth").style.width = player.health + "%"
    }

  // End game based on health
  if (player.health <= 0 || enemy.health <= 0)
  {
    determineWin({player, enemy, timerId})
  }
  
}
animate()

window.addEventListener("keydown", (event) =>
  {
    switch(event.key)
    {
      case "d":
        keys.d.pressed = true
        player.lastKey = "d"
        break
      case "a":
        keys.a.pressed = true
        player.lastKey = "a"
        break
      case "w":
        if (player.isGrounded)
        {
          player.velocity.y = -20
          player.isGrounded = false
        }
        break
      case " ":
        player.attack()
        break
    }

    switch(event.key)
      {
        case "ArrowRight":
          keys.ArrowRight.pressed = true
          enemy.lastKey = "ArrowRight"
          break
        case "ArrowLeft":
          keys.ArrowLeft.pressed = true
          enemy.lastKey = "ArrowLeft"
          break
        case "ArrowUp":
          if (enemy.isGrounded)
            {
              enemy.velocity.y = -20
              enemy.isGrounded = false
            }
          break
        case "ArrowDown":
          enemy.attack()
          break
      }
  }
)

window.addEventListener("keyup", (event) =>
  {
    switch(event.key)
    {
      case "d":
        keys.d.pressed =false
      break
      case "a":
        keys.a.pressed = false
      break
    }

    switch(event.key)
    {
      case "ArrowRight":
        keys.ArrowRight.pressed =false
      break
      case "ArrowLeft":
        keys.ArrowLeft.pressed = false
      break
    }
  }
)