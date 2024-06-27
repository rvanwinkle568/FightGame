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
      },
      fall: 
      {
        imageSrc: "./assets/samuraiMack/Fall.png",
        framesMax: 2
      },
      attack1: 
      {
        imageSrc: "./assets/samuraiMack/Attack1.png",
        framesMax: 6
      },
      takeHit: 
      {
        imageSrc: "./assets/samuraiMack/Take Hit - white silhouette.png",
        framesMax: 4
      }
    },
    attackBox: 
    {
      offset: 
      {
        x: 100,
        y: 50
      },
      width: 160,
      height: 50
    }
  }
)


const enemy = new Fighter
(
  {
    position:
    {
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
    },
    imageSrc: "./assets/kenji/Idle.png",
    framesMax: 4,
    scale: 2.5,
    offset: 
    {
      x: 215,
      y: 167
    },
    sprites: 
    {
      idle: 
      {
        imageSrc: "./assets/kenji/Idle.png",
        framesMax: 4
      },
      run: 
      {
        imageSrc: "./assets/kenji/Run.png",
        framesMax: 8
      },
      jump: 
      {
        imageSrc: "./assets/kenji/Jump.png",
        framesMax: 2
      },
      fall: 
      {
        imageSrc: "./assets/kenji/Fall.png",
        framesMax: 2
      },
      attack1: 
      {
        imageSrc: "./assets/kenji/Attack1.png",
        framesMax: 4
      },
      takeHit:
      {
        imageSrc: "./assets/kenji/Take hit.png",
        framesMax: 3
      }
    },
    attackBox: 
    {
      offset: 
      {
        x: -170,
        y: 50
      },
      width: 170,
      height: 50
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
  enemy.update()

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
  else if (player.velocity.y > 0)
  {
    player.switchSprite("fall")  
  }

  //Enemy movement
  enemy.velocity.x = 0
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft")
  {
    enemy.velocity.x = -5
    enemy.switchSprite("run")
  }
  else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight")
  {
    enemy.velocity.x = 5
    enemy.switchSprite("run")
  }
  else
  {
    enemy.switchSprite("idle")
  }

  if (enemy.velocity.y < 0)
    {
      enemy.switchSprite("jump")
    }
    else if (enemy.velocity.y > 0)
    {
      enemy.switchSprite("fall")  
    }

  //Detect for collision player
  if ( rectCollision({rect1: player, rect2: enemy}) && player.isAttacking &&
     player.currFrame === 4)
  {
    enemy.takeHit()
    player.isAttacking = false
    document.querySelector("#enemyHealth").style.width = enemy.health + "%"
  }
  //If player misses
  if (player.isAttacking && player.currFrame === 4)
  {
    player.isAttacking = false
  }
  

  //Detect for collision enemy
  if ( rectCollision({rect1: enemy, rect2: player}) && enemy.isAttacking &&
     enemy.currFrame === 2)
    {
      player.takeHit()
      enemy.isAttacking = false
      document.querySelector("#playerHealth").style.width = player.health + "%"
    }
  //If enemy misses
  if (enemy.isAttacking && enemy.currFrame === 2)
  {
    enemy.isAttacking = false
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
