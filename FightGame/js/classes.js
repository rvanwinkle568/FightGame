  class Sprite 
  {
    constructor({ position, imageSrc, scale = 1, framesMax = 1, 
    offset = { x: 0, y: 0 } }) 
    {
      this.position = position
      this.image = new Image()
      this.image.src = imageSrc
      this.scale = scale
      this.framesMax = framesMax
      this.currFrame = 0
      this.elapsedFrame = 0
      this.holdFrame = 5
      this.offset = offset
    }

    draw() 
    {
      if (this.framesMax > 1) 
      {
        // For animated sprites
        c.drawImage(
          this.image,
          this.currFrame * (this.image.width / this.framesMax),
          0,
          this.image.width / this.framesMax,
          this.image.height,                 
          this.position.x - this.offset.x,                  
          this.position.y - this.offset.y,                  
          (this.image.width / this.framesMax) * this.scale, 
          this.image.height * this.scale 
        )
      } else {
        // For static sprites
        c.drawImage(
          this.image,
          this.position.x - this.offset.x, 
          this.position.y - this.offset.y, 
          this.image.width * this.scale, 
          this.image.height * this.scale 
        )
      }
    }

    animateFrames() 
    {
      if (this.framesMax > 1) 
      {
        this.elapsedFrame++;
        if (this.elapsedFrame % this.holdFrame === 0) 
        {
          if (this.currFrame < this.framesMax - 1) 
          {
            this.currFrame++;
          } 
          else 
          {
            this.currFrame = 0;
          }
        }
      }
    }

    update() 
    {
      this.draw();
      this.animateFrames();
    }
  }

class Fighter extends Sprite
{
  constructor({position, velocity, color = "red", imageSrc, scale = 1,           framesMax = 1, offset = {x: 0, y: 0}, sprites, attackBox = {offset: {x: 0, y: 0}, width: undefined, height: undefined}})
  {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset
    })
    this.velocity = velocity
    this.width = 50
    this.height = 150
    this.lastKey
    this.attackBox =
    {
      position: 
      {
        x: this.position.x,
        y: this.position.y
      },
      offset: attackBox.offset,
      height: attackBox.height,
      width: attackBox.width
    }
    this.color = color
    this.isAttacking
    this.isGrounded = false
    this.health = 100
    this.currFrame = 0        //current frame
    this.elapsedFrame = 0     //amount of frames elapsed
    this.holdFrame = 5       //holds the frame for a certain amount of time
    this.sprites = sprites

    for (const sprite in this.sprites)
    {
      sprites[sprite].image = new Image()
      sprites[sprite].image.src = sprites[sprite].imageSrc
    }

    console.log(this.sprites)

  }

  update()
  {
    this.draw()
    this.animateFrames()

    this.attackBox.position.x = this.position.x + this.attackBox.offset.x
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y

    //For drawing attack box
    // c.fillRect(this.attackBox.position.x, this.attackBox.position.y,                  this.attackBox.width, this.attackBox.height)
    
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96)
    {
      this.velocity.y = 0
      this.position.y = 330
      this.isGrounded = true
    } 
    else
    {
      this.velocity.y += gravity
      this.isGrounded = false
    }
  }

  attack()
  {
    this.switchSprite("attack1")
    this.isAttacking = true
  }

  takeHit()
  {
    this.switchSprite("takeHit")
    this.health -= 20
  }

  switchSprite(sprite)
  {
    //override all other animations when attacking
    if (this.image === this.sprites.attack1.image && 
        this.currFrame < this.sprites.attack1.framesMax - 1) return

    //Override all other animations when hit
    if (this.image === this.sprites.takeHit.image && this.currFrame <                   this.sprites.takeHit.framesMax - 1) return
    
    switch(sprite)
    {
      case "idle":
        if (this.image !== this.sprites.idle.image)
        {
          this.image = this.sprites.idle.image
          this.framesMax = this.sprites.idle.framesMax
          this.currFrame = 0
        }
      break
      case "run":
        if (this.image !== this.sprites.run.image)
        {
          this.image = this.sprites.run.image
          this.framesMax = this.sprites.run.framesMax
          this.currFrame = 0
        }
      break
      case "jump":
        if (this.image !== this.sprites.jump.image)
        {
          this.image = this.sprites.jump.image
          this.framesMax = this.sprites.jump.framesMax
          this.currFrame = 0
        }
      break
      case "fall":
        if (this.image !== this.sprites.fall.image)
        {
          this.image = this.sprites.fall.image
          this.framesMax = this.sprites.fall.framesMax
          this.currFrame = 0
        }
      break
      case "attack1":
        if (this.image !== this.sprites.attack1.image)
        {
          this.image = this.sprites.attack1.image
          this.framesMax = this.sprites.attack1.framesMax
          this.currFrame = 0
        }
      break
      case "takeHit":
        if (this.image !== this.sprites.takeHit.image)
        {
          this.image = this.sprites.takeHit.image
          this.framesMax = this.sprites.takeHit.framesMax
          this.currFrame = 0
        }
      break
    }  
  }
}
