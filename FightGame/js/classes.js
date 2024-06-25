class Sprite
{
  constructor({position, imageSrc, scale = 1, framesMax = 1, 
  offset = {x: 0, y: 0}})
  {
    this.position = position
    this.width = 50
    this.height = 150
    this.image = new Image()
    this.image.src = imageSrc
    this.scale = scale
    this.frameMax = framesMax
    this.currFrame = 0        //current frame
    this.elapsedFrame = 0     //amount of frames elapsed
    this.holdFrame = 5       //holds the frame for a certain amount of time
    this.offset = offset
  }

  draw()
  {
    c.drawImage(
      //Cropping
      this.image,
      this.currFrame * (this.image.width / this.frameMax),
      0,
      this.image.width / this.frameMax,
      this.image.height,
      
      this.position.x - this.offset.x, 
      this.position.y - this.offset.y, 
      (this.image.width / this.frameMax) * this.scale,
      this.image.height * this.scale
    )
  }

  animateFrames()
  {
    this.elapsedFrame++
    if (this.elapsedFrame % this.holdFrame === 0) 
    {
      if(this.currFrame < this.frameMax - 1)
      {
        this.currFrame++
      }
      else
      {
        this.currFrame = 0
      }
    }
  }
  
  update()
  {
    this.draw()
    this.animateFrames()
   
  }
}

class Fighter extends Sprite
{
  constructor({position, velocity, color = "red", imageSrc, scale = 1,           framesMax = 1, offset = {x: 0, y: 0}, sprites})
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
      offset,
      height: 50,
      width: 100
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
    this.attackBox.position.y = this.position.y

    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96)
    {
      this.velocity.y = 0
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
    this.isAttacking = true
    setTimeout(() => 
      {
      this.isAttacking = false
      }, 100)
  }

  switchSprite(sprite)
  {
    switch(sprite)
    {
      case "idle":
        if (this.image !== this.sprites.idle.image)
        {
          this.image = player.sprites.idle.image
          this.framesMax = this.sprites.idle.framesMax
          this.currFrame = 0
        }
      break
      case "run":
        if (this.image !== this.sprites.run.image)
        {
          this.image = player.sprites.run.image
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
    }  
  }
}