import { Clock, EventDispatcher, Vector3, Matrix4, Quaternion, Object3D } from 'three'
import { loadAmmo } from './loadAmmo'

// var Module = { TOTAL_MEMORY: 256*1024*1024 };
// self.importScripts('/ammo/ammo.wasm.js');

export class AmmoCharacterControl {
  constructor ({ base, size, uuid, position, quaternion }) {
    this.base = base
    this.onLoop = base.onLoop.bind(base)
    this.size = size

    this.createCharacter({ uuid, position, quaternion })
  }

  async createCharacter ({ uuid, position, quaternion }) {
    let { Ammo } = this.base
    var startTransform = new Ammo.btTransform();

    let size = this.size
    let makeCapsuleShape = (x, y) => new Ammo.btCapsuleShape(x, y)
    let characterCapsuleShape = makeCapsuleShape(size.x, size.y, size.z)
    let targetO3 = new Object3D()

    targetO3.position.copy(position)
    targetO3.quaternion.copy(quaternion)

    startTransform.setIdentity();
    startTransform.setOrigin(new Ammo.btVector3(targetO3.position.x, targetO3.position.y, targetO3.position.z));
    startTransform.setRotation(new Ammo.btQuaternion(targetO3.quaternion.x, targetO3.quaternion.y, targetO3.quaternion.z, targetO3.quaternion.w))

    var shape = characterCapsuleShape
    var mass = 1;
    let margin = 0.05;
    var localInertia = new Ammo.btVector3(0, 0, 0);
    shape.calculateLocalInertia(mass, localInertia);
    shape.setMargin(margin)

    var myMotionState = new Ammo.btDefaultMotionState(startTransform);
    var rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, myMotionState, shape, localInertia);
    var body = new Ammo.btRigidBody(rbInfo);

    body.name = 'Char'
    body.isChar = true

    let velocity = new Ammo.btVector3(0, 0, 0)
    let angularVelocity = new Ammo.btVector3(0, 0, 0)
    let angularFactor = new Ammo.btVector3(0, 0, 0)
    // let linearFactor = new Ammo.btVector3(1, 1, 1)

    body.setDamping(0.95, 0.99)

    body.uuid = uuid

    this.base.dynamicsWorld.addRigidBody(body)
    this.base.bodiesMap.set(uuid, body)

    let v3 = new Vector3()
    let speed = 7 * 1.25

    let transform = new Ammo.btTransform()
    let joystickVector = new Vector3()
    this.onLoop(() => {
      let keys = this.base.keys
      if (!keys) {
        return
      }

      body.getMotionState().getWorldTransform(transform)
      let rot = transform.getRotation()
      let quaternion = new Quaternion()
      quaternion.copy({
        x: rot.x(),
        y: rot.y(),
        z: rot.z(),
        w: rot.w()
      })

      if (keys.isDownAny) {
        body.activate()
      }

      angularFactor.setValue(0, 0, 0)
      body.setAngularFactor(angularFactor)

      if (keys.joystick) {
        joystickVector.x = -keys.joystick.vector.x * speed * 1.25
        joystickVector.z = keys.joystick.vector.y * speed * 1.25
      }
      if (keys.joystick) {
        v3.copy(joystickVector)
        v3.applyQuaternion(quaternion)

        velocity.setValue(v3.x, 0, v3.z)
        body.applyCentralImpulse(velocity)
      } else {
        if (keys.forward) {
          v3.x = 0
          v3.y = 0
          v3.z = speed

          if (keys.joystick) {
            v3.copy(joystickVector)
          }

          v3.applyQuaternion(quaternion)

          velocity.setValue(v3.x, 0, v3.z)
          body.applyCentralImpulse(velocity)
        }

        if (keys.backward) {
          v3.x = 0
          v3.y = 0
          v3.z = -speed

          if (keys.joystick) {
            v3.copy(joystickVector)
          }
          v3.applyQuaternion(quaternion)

          velocity.setValue(v3.x, 0, v3.z)
          body.applyCentralImpulse(velocity)
        }

        if (keys.left) {
          v3.x = speed
          v3.y = 0
          v3.z = 0

          if (keys.joystick) {
            v3.copy(joystickVector)
          }
          v3.applyQuaternion(quaternion)

          velocity.setValue(v3.x, 0, v3.z)
          body.applyCentralImpulse(velocity)
        }

        if (keys.right) {
          v3.x = -speed
          v3.y = 0
          v3.z = 0

          if (keys.joystick) {
            v3.copy(joystickVector)
          }
          v3.applyQuaternion(quaternion)

          velocity.setValue(v3.x, 0, v3.z)
          body.applyCentralImpulse(velocity)
        }
      }


      this.height = this.height || 0
      // let vel = body.getLinearVelocity()
      // if (Math.abs(vel.y()) <= 0.1) {
      //   this.jumping = false
      // }
      // let isMoving = keys.forward || keys.backward || keys.left || keys.right
      if (keys.space && keys.forward) {
        body.activate()

        if (this.height < 500) {
          velocity.setValue(0, 10.0, 0)
          body.applyCentralImpulse(velocity)
          this.height += 10
        }
      } else if (keys.space) {
        if (this.height < 500) {
          velocity.setValue(0, this.height * this.height / 50 / 50 / 6 * 2.5, 0)
          body.applyCentralImpulse(velocity)
          this.height += 10
        }
      } else {
        if (this.height > 0) {
          this.height -= 100
        } else if (this.height <= 0) {
          this.height = 0
        }
      }
      // console.log(this.height)

      if (keys.turnLeft) {
        angularVelocity.setValue(0, 1.75, 0)
        body.setAngularVelocity(angularVelocity)

        angularFactor.setValue(0, 1, 0)
        body.setAngularFactor(angularFactor)
      }
      if (keys.turnRight) {
        angularVelocity.setValue(0, -1.75, 0)
        body.setAngularVelocity(angularVelocity)

        angularFactor.setValue(0, 1, 0)
        body.setAngularFactor(angularFactor)
      }

      if (keys.joystick) {
        // console.log(keys.joystick.angle.radian)
        let rot = (keys.joystick.angle.radian % (Math.PI)) - Math.PI / 2
        rot *= 1.51

        let flip = 1
        let checker = (keys.joystick.angle.radian - (Math.PI / 2))
        if (Math.abs(checker) > Math.PI * 0.5) {
          flip = -1
        }
        angularVelocity.setValue(0, rot * flip, 0)
        body.setAngularVelocity(angularVelocity)

        angularFactor.setValue(0, rot * flip, 0)
        body.setAngularFactor(angularFactor)
      }

      // if (keys.joystick) {
      //   // console.log(keys.joystick)
      // }
    })
  }
}

export class AmmoWorld extends EventDispatcher {
  constructor({ mode = 'auto', onLoop }) {
    super()
    this.onLoop = onLoop

    this.shapeCache = new Map()
    this.canRun = true
    this.clock = new Clock()
    this.fncs = []
    this.mode = mode
    this.gravityConstant = 9.89
    this.margin = 0.05

    this.keys = false

    this.bodiesMap = new Map()
    this.applyPhysicsMap = new Map()
    this.temp = {}
    this.done = this.prepare()

    this.you = false
    this.tasks = []
  }

  async createYou ({ size, uuid, position, quaternion }) {
    position = new Vector3().fromArray(position)
    quaternion = new Quaternion().fromArray(quaternion)
    this.you = new AmmoCharacterControl({ base: this, size, uuid, position, quaternion })
  }

  syncKeys ({ keys }) {
    this.keys = keys
  }
  onLoop (v) {
    this.tasks.push(v)
  }
  async load () {
    this.Ammo = await loadAmmo()
  }
  async prepare () {
    return this.load().then(() => {
    }).then(() => {
      return this.setup()
    })
  }
  async waitForSetup () {
    return this.done
  }
  async setup () {
    let { Ammo } = this

    // world config
    let collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
    let dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
    let broadphase = new Ammo.btDbvtBroadphase();
    let solver = new Ammo.btSequentialImpulseConstraintSolver();
    let dynamicsWorld = new Ammo.btDiscreteDynamicsWorld( dispatcher, broadphase, solver, collisionConfiguration );
    dynamicsWorld.setGravity( new Ammo.btVector3( 0, -this.gravityConstant * 25.0, 0 ) );

    this.dynamicsWorld = dynamicsWorld
    this.dispatcher = dispatcher

    var transform = new Ammo.btTransform();
    this.onLoop(() => {
      if (this.mode === 'manual') {
        if (!this.ready) {
          return
        }
      }

      if (!this.canRun) {
        return
      }

      var deltaTime = this.clock.getDelta();
      dynamicsWorld.stepSimulation(deltaTime, 7);
      // let delta = this.clock.getDelta()

      try {
        this.tasks.forEach(e => e())
      } catch (e) {
        console.log(e)
      }

      let bodies = this.bodiesMap.entries()
      for (let [uuid, body] of bodies) {
        body.getMotionState().getWorldTransform(transform)
        var origin = transform.getOrigin()

        let position = {
          x: origin.x(),
          y: origin.y(),
          z: origin.z()
        }

        var rotation = transform.getRotation();

        let quaternion = {
          x: rotation.x(),
          y: rotation.y(),
          z: rotation.z(),
          w: rotation.w()
        }

        this.applyPhysicsMap.set(uuid, {
          position,
          quaternion
        })
      }

      this.replyAll(this.applyPhysicsMap)
    })

    this.setupCollision()
  }
  subscribe (subscriber) {
    this.fncs.push(subscriber)
  }

  setupCollision () {
    let { Ammo } = this
    let vec3 = new Ammo.btVector3()
    this.onLoop(() => {
      let dispatcher = this.dispatcher
      for (let i = 0, il = dispatcher.getNumManifolds(); i < il; i++) {
        const contactManifold = dispatcher.getManifoldByIndexInternal(i)
        // const key = Object.keys(contactManifold.getBody0())[0]

        const body0 = Ammo.castObject(contactManifold.getBody0(), Ammo.btRigidBody)
        const body1 = Ammo.castObject(contactManifold.getBody1(), Ammo.btRigidBody)

        // do not check collision between 2 unnamed objects
        // (fragments do not have a name, for example)
        if (body0.name === '' && body1.name === '') continue

        let character = false
        let halo = false

        if ((body0.isChar && body1.isHalo)) {
          character = body0
          halo = body1
        }
        if ((body1.isChar && body0.isHalo)) {
          character = body1
          halo = body0
        }
        if (character && halo) {
          // console.log(character, halo)
          vec3.setValue(0, 2.5, 0)
          halo.applyCentralImpulse(vec3)
          this.dispatchEvent({
            type: 'halo',
            body: halo,
            uuid: halo.uuid
          })
        }
      }
    })
  }

  addMesh ({ info = {}, geoUUID, uuid, array, target, position, quaternion, matrixWorld, scale, rootScale, mass }) {
    let center = new Vector3()
    target = new Vector3().fromArray(target)
    scale = new Vector3().fromArray(scale)
    position = new Vector3().fromArray(position)
    quaternion = new Quaternion().fromArray(quaternion)
    matrixWorld = new Matrix4().fromArray(matrixWorld)

    let shape = this.shapeCache.has(geoUUID) ? this.shapeCache.get(geoUUID) : this.getShapeFromInfo({ array, rootScale, target, scale, matrixWorld, center })
    this.shapeCache.set(geoUUID, shape)
    let body = this.makeBody({ uuid, shape, mass, position, quaternion, scale })
    for (let kn in info) {
      body[kn] = info[kn]
    }

    body.isWorld = true
    body.uuid = uuid

    this.dynamicsWorld.addRigidBody(body)
    this.bodiesMap.set(uuid, body)
  }

  getShapeFromInfo ({ array, rootScale, target, scale, matrixWorld, center }) {
    let { Ammo, margin } = this
    const originalHull = new Ammo.btConvexHullShape()
    originalHull.setMargin(margin)

    let inverse = new Matrix4()
    let transformM4 = new Matrix4()

    transformM4.identity()
    transformM4.makeTranslation(target.x, target.y, target.z)

    let btVertex = new Ammo.btVector3()
    const rawVertexData = array
    let vertex = new Vector3()
    for (let i = 0; i < rawVertexData.length; i += 3) {
      transformM4.multiplyMatrices(inverse, matrixWorld)
      vertex
        .set(rawVertexData[i], rawVertexData[i + 1], rawVertexData[i + 2])
        .applyMatrix4(transformM4)
        .sub(center)
      btVertex.setValue(vertex.x, vertex.y, vertex.z)
      originalHull.addPoint(btVertex, i === rawVertexData.length - 3)
    }

    originalHull.type = 'hull'
    originalHull.setMargin(margin)
    originalHull.destroy = () => {
      for (let res of originalHull.resources || []) {
        Ammo.destroy(res)
      }
      if (originalHull.heightfieldData) {
        Ammo._free(originalHull.heightfieldData)
      }
      Ammo.destroy(originalHull)
    }

    let localScale = new Ammo.btVector3(rootScale * scale.x, rootScale * scale.y, rootScale * scale.z)
    originalHull.setLocalScaling(localScale)
    Ammo.destroy(localScale)

    return originalHull
  }

  makeBody ({ uuid, shape, mass, position, quaternion, scale }) {
    let { Ammo } = this

    let startTransform = new Ammo.btTransform();
    startTransform.setIdentity();
    startTransform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));
    startTransform.setRotation(new Ammo.btQuaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w))

    var localInertia = new Ammo.btVector3(0, 0, 0);
    shape.calculateLocalInertia(mass, localInertia);

    var myMotionState = new Ammo.btDefaultMotionState(startTransform);
    var rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, myMotionState, shape, localInertia);
    var body = new Ammo.btRigidBody(rbInfo);

    body.uuid = uuid

    const localScale = new Ammo.btVector3(scale.x, scale.y, scale.z)
    // localScale.setValue(scale.x, scale.y, scale.z)
    shape.setLocalScaling(localScale)

    Ammo.destroy(localScale)
    Ammo.destroy(startTransform)

    return body
  }


  replyAll (v) {
    let n = this.fncs.length
    for (var i = 0; i < n; i++) {
      this.fncs[i](v)
    }
  }
  close () {
    // close()
    // console.log('terminated')
  }
}