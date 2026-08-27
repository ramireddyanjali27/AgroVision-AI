import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function detectWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

function buildTomato() {
  const group = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({
    color: 0xe23b2e,
    roughness: 0.35,
    metalness: 0.05,
  })
  const body = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 40), mat)
  body.scale.set(1, 1.02, 1)
  group.add(body)

  const dark = new THREE.MeshStandardMaterial({ color: 0x2f7d32, roughness: 0.4 })
  const calyx = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.5, 6), dark)
  calyx.position.y = 0.98
  calyx.rotation.x = Math.PI
  group.add(calyx)

  const stemMat = new THREE.MeshStandardMaterial({ color: 0x1e7d36, roughness: 0.55 })
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.55, 12), stemMat)
  stem.position.y = 1.2
  group.add(stem)
  return group
}

function buildCucumber() {
  const group = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: 0x3f9b3f, roughness: 0.45 })
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.46, 2.2, 28), mat)
  body.rotation.z = Math.PI / 2
  group.add(body)
  const dark = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.5 })
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.4, 20, 20), dark)
  tip.scale.set(1, 1, 1.4)
  group.add(tip)
  return group
}

function buildLeaf() {
  const group = new THREE.Group()
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.bezierCurveTo(1.1, 0.5, 1.1, -0.5, 0, 0)
  const geo = new THREE.ShapeGeometry(shape)
  const mat = new THREE.MeshStandardMaterial({
    color: 0x4caf50,
    roughness: 0.5,
    side: THREE.DoubleSide,
  })
  const leaf = new THREE.Mesh(geo, mat)
  leaf.scale.set(1.2, 0.5, 1)
  leaf.position.z = 0.06
  group.add(leaf)
  const vein = new THREE.Mesh(new THREE.PlaneGeometry(0.03, 1.2), mat)
  vein.rotation.x = -Math.PI / 2
  group.add(vein)
  return group
}

function buildSprout() {
  const group = new THREE.Group()
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.5 })
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 1.4, 12), stemMat)
  stem.position.y = 0.6
  group.add(stem)
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x66bb6a, roughness: 0.5 })
  const l1 = new THREE.Mesh(new THREE.SphereGeometry(0.32, 20, 20), leafMat)
  l1.scale.set(1.3, 0.5, 1)
  l1.position.set(0.28, 1.25, 0.1)
  l1.rotation.z = -0.4
  group.add(l1)
  const l2 = l1.clone()
  l2.material = leafMat
  l2.position.set(-0.32, 1.15, -0.1)
  l2.rotation.z = 0.5
  group.add(l2)
  return group
}

const Hero3DScene = () => {
  const mountRef = useRef(null)
  const [webgl, setWebgl] = useState(null)

  useEffect(() => {
    setWebgl(detectWebGL())
  }, [])

  useEffect(() => {
    if (webgl === false || !mountRef.current) return

    const mount = mountRef.current
    const reduced = prefersReducedMotion()

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100)
    camera.position.set(0, 1.2, 7)
    camera.lookAt(0, 0.4, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    mount.appendChild(renderer.domElement)

    const hemi = new THREE.HemisphereLight(0xffffff, 0x0b5a3a, 1.1)
    scene.add(hemi)
    const key = new THREE.DirectionalLight(0xffffff, 1.1)
    key.position.set(4, 6, 5)
    key.castShadow = true
    scene.add(key)
    const rim = new THREE.DirectionalLight(0x88e0b0, 0.6)
    rim.position.set(-4, 2, -4)
    scene.add(rim)

    const tomato = buildTomato()
    tomato.position.set(-2.1, 1.1, 0)
    const cucumber = buildCucumber()
    cucumber.position.set(2.2, 0.9, -0.4)
    const leaf = buildLeaf()
    leaf.position.set(-2.2, 1.6, -1.2)
    const sprout = buildSprout()
    sprout.position.set(2.3, 1.3, -1)

    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(3.4, 48),
      new THREE.ShadowMaterial({ opacity: 0.28 })
    )
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -0.05

    const objects = [tomato, cucumber, leaf, sprout]
    objects.forEach((o) => {
      o.castShadow = true
      scene.add(o)
    })
    scene.add(ground)

    let mouseX = 0
    let mouseY = 0
    let targetX = 0
    let targetY = 0

    const onPointerMove = (e) => {
      const rect = mount.getBoundingClientRect()
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    }
    mount.addEventListener('pointermove', onPointerMove)

    let raf = 0
    let running = true
    const observer = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting && !reduced
    })
    observer.observe(mount)

    const clock = new THREE.Clock()
    const animate = () => {
      raf = requestAnimationFrame(animate)
      if (!running) return
      const t = clock.getElapsedTime()
      targetX += (mouseX - targetX) * 0.04
      targetY += (mouseY - targetY) * 0.04

      tomato.rotation.y = Math.sin(t * 0.5) * 0.3 + targetX * 0.25
      tomato.position.y = 1.1 + Math.sin(t * 1.1) * 0.18
      tomato.rotation.x = -0.1 + targetY * 0.15

      cucumber.rotation.z = Math.PI / 2 + Math.sin(t * 0.7) * 0.12
      cucumber.position.y = 0.9 + Math.sin(t * 0.9 + 1) * 0.15

      leaf.rotation.z = Math.sin(t * 0.6) * 0.3 + targetX * 0.2
      leaf.position.x = -2.2 + Math.sin(t * 0.8) * 0.12
      leaf.position.y = 1.6 + Math.sin(t * 1.2 + 2) * 0.12

      sprout.rotation.y = Math.sin(t * 0.6) * 0.4
      sprout.position.y = 1.3 + Math.sin(t * 1 + 3) * 0.12

      camera.position.x += (targetX * 0.5 - camera.position.x) * 0.04
      camera.lookAt(0, 0.4, 0)
      renderer.render(scene, camera)
    }
    if (!reduced) animate()
    else renderer.render(scene, camera)

    const onResize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      mount.removeEventListener('pointermove', onPointerMove)
      observer.disconnect()
      cancelAnimationFrame(raf)
      objects.forEach((o) => o.traverse((c) => {
        if (c.geometry) c.geometry.dispose()
      }))
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [webgl])

  if (webgl === false) {
    return (
      <div className="hero-3d-fallback">
        <div className="fb-tomato">🍅</div>
        <div className="fb-cucumber">🥒</div>
        <div className="fb-leaf">🍃</div>
        <div className="fb-sprout">🌱</div>
        <div className="fb-ground"></div>
      </div>
    )
  }

  return <div className="hero-3d-canvas" ref={mountRef} aria-hidden="true"></div>
}

export default Hero3DScene
