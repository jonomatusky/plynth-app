import { useCallback, useEffect, useRef, useState } from 'react'

import * as THREE from 'three'
import 'mind-ar/dist/mindar-image.prod'

import videoSrc from 'assets/videos/IMG_4700.MP4'

function App() {
  // General app state
  const [arReady, setARReady] = useState(false)

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const animationFrameRef = useRef()

  // ThreeJS
  const rendererRef = useRef()
  const sceneRef = useRef()
  const cameraRef = useRef()

  // MindAR
  const markerRef = useRef()
  const controllerRef = useRef()

  /**
   * Starts webcam via navigator.mediaDevices api
   */
  const startVideo = async () => {
    const video = videoRef.current

    if (video) {
      // const mediaDevices = navigator.mediaDevices

      // const stream = await mediaDevices.getUserMedia({
      //   audio: false,
      //   video: {
      //     facingMode: 'environment',
      //     aspectRatio: 1.777777778,
      //   },
      // })

      // video.srcObject = stream

      video.src = videoSrc
      video.muted = true
      video.autoPlay = true
      video.loop = true
      video.width = window.innerWidth
      video.height = window.innerHeight

      video.play()
    } else {
      console.error('Missing video DOM element')
    }
  }

  /**
   * Starts canvas and renderer for ThreeJS
   */
  const startCanvas = () => {
    const canvas = canvasRef.current
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    })

    renderer.setClearColor(0x000000, 0)
    renderer.setSize(window.innerWidth, window.innerHeight)

    rendererRef.current = renderer
  }

  /**
   * Initializes a single MindAR marker and sets it to a mutable ref.
   * An index of 0 and a path to the .mind file is hardcoded here for simplicity.
   */
  const initMarker = useCallback(() => {
    const postMatrix = new THREE.Matrix4()

    const anchor = new THREE.Object3D()
    anchor.visible = false
    anchor.matrixAutoUpdate = false

    markerRef.current = {
      postMatrix,
      anchor,
      targetIndex: 0,
      targetSrc:
        'https://plynth-barebones.s3.us-east-2.amazonaws.com/a9664331-19a2-4f82-8441-790ac8da8bc2.mind ',
      setupMarker,
      updateWorldMatrix,
    }
  }, [])

  /**
   * Creates a 3d anchor using ThreeJS in the center of a target image
   * with respect to the target image dimensions.
   * @param {[number, number]} dimensions - Image target dimensions.
   */
  const setupMarker = dimensions => {
    const [width, height] = dimensions
    const marker = markerRef.current
    const matrix = new THREE.Matrix4()

    const position = new THREE.Vector3(
      width / 2,
      width / 2 + (height - width) / 2
    )

    const scale = new THREE.Vector3(width, width, width)

    const quaternion = new THREE.Quaternion()

    matrix.compose(position, quaternion, scale)

    marker.postMatrix = matrix
  }

  /**
   * Updates the world matrix of a single marker in a ThreeJS scene. If
   * the matrix is found (not null), then we make the anchor visible.
   * @param {number[] | null} worldMatrixUpdate - The elements of a Matrix4
   * object representing the updated world matrix of a marker
   */
  const updateWorldMatrix = worldMatrixUpdate => {
    const matrixFound = worldMatrixUpdate !== null
    const marker = markerRef.current
    const anchor = marker.anchor

    // You can use callbacks here to trigger on target lost/found
    if (anchor.visible && matrixFound) {
      console.log('Target Found')
    } else if (anchor.visible && !matrixFound) {
      // console.log('Target Lost')
    }

    // This line toggles ThreeJS object visibility in the scene
    anchor.visible = matrixFound

    if (matrixFound) {
      const postMatrix = marker.postMatrix
      const updatedMatrix = new THREE.Matrix4()
      updatedMatrix.elements = worldMatrixUpdate
      updatedMatrix.multiply(postMatrix)
      anchor.matrix = updatedMatrix
    }
  }

  /**
   * Creates a new AR Controller for MindAR and sets mutable ref
   * @returns arController - An AR Controller instance
   */
  const initController = () => {
    // arController is type `any` here
    // Consider making a wrapper interface
    const arController = new window.MINDAR.IMAGE.Controller({
      inputWidth: window.innerWidth,
      inputHeight: window.innerHeight,
      onUpdate: data => {
        // There are a couple data `types`
        // Check the MindAR source for more info
        // https://github.com/hiukim/mind-ar-js/blob/master/src/image-target/controller.js
        if (data.type === 'updateMatrix') {
          const { targetIndex, worldMatrix } = data

          let candidate = markerRef.current

          if (candidate.targetIndex === targetIndex) {
            candidate.updateWorldMatrix(worldMatrix)
          }
        }
      },
    })

    controllerRef.current = arController

    return arController
  }

  /**
   * Registers marker with controller then sets marker dimensions.
   * @param arController MindAR Controller instance
   */
  const registerMarker = async arController => {
    const marker = markerRef.current

    // addImageTargets returns object { dimensions, matchingDataList, trackingDataList }
    // Check MindAR source for more info
    // https://github.com/hiukim/mind-ar-js/blob/master/src/image-target/controller.js#L67-L104
    const data = await arController.addImageTargets(marker.targetSrc)

    // data.dimensions is an array of width, height pairs for target images.
    // We only have one target image - index 0.
    marker.setupMarker(data.dimensions[0])
  }

  /**
   * Creates a new ThreeJS camera
   * @param arController MindAR Controller instance
   */
  const setupCamera = arController => {
    const camera = new THREE.PerspectiveCamera()

    const proj = arController.getProjectionMatrix()

    camera.fov = (2 * Math.atan(1 / proj[5]) * 180) / Math.PI
    camera.aspect = window.innerWidth / window.innerHeight
    camera.near = proj[14] / (proj[10] - 1.0)
    camera.far = proj[14] / (proj[10] + 1.0)
    camera.updateProjectionMatrix()

    cameraRef.current = camera
  }

  /**
   * Creates a new ThreeJS Scene, adds a cube, lighting and AR marker
   * anchor. Sets mutable scene ref.
   */
  const composeScene = () => {
    const scene = new THREE.Scene()
    const marker = markerRef.current
    const anchor = marker.anchor

    // You can replace the next 10 lines with your own scene
    // logic; just remember to `add` your models to the anchor and
    // add the anchor + lighting to the scene.
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
    const cube = new THREE.Mesh(geometry, material)

    const light = new THREE.DirectionalLight(0xff0000, 0.5)
    light.rotation.x = Math.PI / 2
    light.position.set(1, 1, 1)

    anchor.add(cube)
    scene.add(anchor, light)

    sceneRef.current = scene
  }

  useEffect(() => {
    const startAR = async () => {
      // Generic webcam and ThreeJS canvas init
      await startVideo()
      startCanvas()

      // MindAR init
      initMarker()
      const controller = initController()
      await registerMarker(controller)

      // ThreeJS Camera and Scene init
      setupCamera(controller)
      composeScene()

      // AR Controller needs to warm up gpu
      // Check MindAR source for more info
      // https://github.com/hiukim/mind-ar-js/blob/master/src/image-target/controller.js#L106-L112
      await controller.dummyRun(videoRef.current)

      // This triggers AR processing and scene render
      setARReady(true)
    }

    startAR()
  }, [initMarker])

  useEffect(() => {
    if (arReady) {
      const animateScene = () => {
        const renderer = rendererRef.current
        const camera = cameraRef.current
        const scene = sceneRef.current

        renderer.render(scene, camera)
        animationFrameRef.current = window.requestAnimationFrame(() => {
          animateScene()
        })
      }

      // `processVideo` detects, describes, matches, tracks features
      // and updates worldMatrix model.
      // See below monstrosity.
      // https://github.com/hiukim/mind-ar-js/blob/master/src/image-target/controller.js#L134-L256
      controllerRef.current.processVideo(videoRef.current)

      // Render loop
      animateScene()
    }
  }, [arReady])

  // CSS
  const appStyle = {
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    position: 'relative',
  }

  const arVideoStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  }

  const arCanvasStyle = {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '0',
    left: '0',
  }

  return (
    <div style={appStyle}>
      <video ref={videoRef} style={arVideoStyle} />
      <canvas ref={canvasRef} style={arCanvasStyle} />
    </div>
  )
}

export default App
