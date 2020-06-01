import React, {
  FunctionComponent,
  memo,
  RefObject,
  useEffect,
  useRef,
  useState,
  Fragment,
} from 'react'

import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'

gsap.registerPlugin(Draggable, InertiaPlugin)

import { iconPaths } from './iconPaths'

// import { PopLines } from './PopLines'
import { SpeechBubble } from './SpeechBubble'

const ICON_SIZE = 32
const ICON_FILL = '#ffffff'
const MULTIPLIER = 4.8
const SPACER = 60

const DOT_SIZE = 10
const DOT_FILL = '#FF69B4'

const MIN_DRAG_X = -(iconPaths.length - 1) * SPACER
const VIEWBOX_WIDTH = SPACER * iconPaths.length

interface SvgProps {
  /** Animation callback passes current reaction */
  onAnimationComplete: (reaction: string) => void
}

export const Svg: FunctionComponent<SvgProps> = memo(
  ({ onAnimationComplete }: SvgProps) => {
    const svgIconBubblesRef = useRef(null)
    const dotContainerRef = useRef(null)
    const iconContainerRef = useRef(null)

    const iconRefs: RefObject<SVGPathElement>[] = []
    const dotRefs: RefObject<SVGCircleElement>[] = []

    const [isMounted, setIsMounted] = useState(false)
    const [posX, setPosX] = useState(0)
    const [snapArray, setSnapArray] = useState([])
    const [mtl, setMtl] = useState({
      timeline: gsap.timeline({ paused: true }),
    })
    const [currentReaction, setCurrentReaction] = useState('')
    // const [isMotionComplete, setIsMotionComplete] = useState(true)

    // This is a hacky work-around because posX gets updated after we need it...
    // resulting in landed returning the wrong icon name
    let _x = 0

    const handleDragSlider = () => {
      setPosX(Number(gsap.getProperty(dotContainerRef.current, 'x')))
      _x = Number(gsap.getProperty(dotContainerRef.current, 'x'))
    }

    const handleAnimationStart = () => {
      console.log('handleAnimationStart')

      // gsap.to(popLinesRef.current, {
      //   duration: 0.5,
      //   y: -130,
      //   ease: 'elastic(1, 0.5)',
      // })
      // setIsMotionComplete(false)
      setCurrentReaction('')
      onAnimationComplete('')
    }

    const handleAnimationComplete = () => {
      console.log('handleAnimationComplete')

      // gsap.set(popLinesRef.current, {
      //   y: -100,
      // })

      const landed = Math.ceil(_x / SPACER)
      // setIsMotionComplete(true)
      setCurrentReaction(iconPaths[Math.abs(landed)].name)
      onAnimationComplete(iconPaths[Math.abs(landed)].name)
    }

    const handleClick = (index: number) => {
      gsap.to([dotContainerRef.current, iconContainerRef.current], {
        duration: 0.8,
        x: snapArray[index],
        onUpdate: handleDragSlider,
        onComplete: handleAnimationComplete,
        ease: 'power1',
      })
    }

    useEffect(() => {
      gsap.set(svgIconBubblesRef.current, {
        visibility: 'visible',
      })

      iconPaths.map((_, index: number) => {
        setSnapArray((snapArray) => [...snapArray, -index * SPACER])
        //
        gsap.set(iconRefs[index], {
          transformOrigin: '50% 50%',
          scale: 0,
        })
        //
        setMtl({
          timeline: (mtl.timeline as any).add(
            gsap
              .timeline()
              .to(dotRefs[index], {
                duration: 1,
                attr: {
                  r: DOT_SIZE * MULTIPLIER,
                },
                ease: 'linear',
              })
              .to(
                iconRefs[index],
                {
                  duration: 1,
                  alpha: 1,
                  scale: 2,
                  ease: 'linear',
                },
                '-=1'
              )
              .to(dotRefs[index], {
                duration: 1,
                attr: {
                  r: DOT_SIZE,
                },
                ease: 'linear',
              })
              .to(
                iconRefs[index],
                {
                  duration: 1,
                  alpha: 0,
                  scale: 0,
                  ease: 'linear',
                },
                '-=1'
              ),
            index / 2
          ),
        })
      })
      //
      gsap.to([dotContainerRef.current, iconContainerRef.current], 2, {
        x: -(6 * SPACER),
        onUpdate: handleDragSlider,
        onComplete: () => {
          handleAnimationComplete()
          setIsMounted(true)
        },
        ease: 'elastic(1, 0.85)',
      })
    }, [])

    useEffect(() => {
      const dragInstance = Draggable.create(dotContainerRef.current, {
        type: 'x',
        bounds: {
          minX: MIN_DRAG_X,
          maxX: 0,
          minY: 0,
          maxY: 0,
        },
        onDrag: handleDragSlider,
        onDragStart: handleAnimationStart,
        onThrowUpdate: handleDragSlider,
        onThrowComplete: handleAnimationComplete,
        inertia: true,
        minDuration: 1,
        snap: snapArray,
        overshootTolerance: 0,
        dragClickables: true,
      })[0].disable()

      if (isMounted) {
        dragInstance.enable()
      }
    }, [isMounted])

    useEffect(() => {
      gsap.to(mtl.timeline, {
        duration: 0.5,
        time: (posX / MIN_DRAG_X) * (mtl.timeline.duration() - 2) + 1,
        ease: 'elastic(2, 0.75)',
      })

      gsap.set(iconContainerRef.current, {
        x: posX,
      })
    }, [posX])

    return (
      <Fragment>
        <div
          style={{
            position: 'relative',
            width: VIEWBOX_WIDTH,
            transform: 'translateY(-100px)',
          }}
        >
          <div
            className="svg-speech-bubble"
            style={{
              position: 'absolute',
              width: VIEWBOX_WIDTH,
            }}
          >
            <svg
              className="svg-details"
              width="80%"
              height="80%"
              viewBox={`0,0, ${VIEWBOX_WIDTH}, 240`}
            >
              {/* <PopLines
                ref={popLinesRef as RefObject<any>}
                color={DOT_FILL}
                viewboxWidth={VIEWBOX_WIDTH}
              /> */}
              <SpeechBubble
                color={DOT_FILL}
                viewboxWidth={VIEWBOX_WIDTH}
                // isMotionComplete={isMotionComplete}
                currentReaction={currentReaction}
              />
            </svg>
          </div>
        </div>

        <svg
          ref={svgIconBubblesRef as RefObject<any>}
          className="svg-icon-bubbles"
          width={VIEWBOX_WIDTH}
          height="100%"
          viewBox={`0,0, ${VIEWBOX_WIDTH},120`}
        >
          <defs>
            <filter id="goo" colorInterpolationFilters="sRGB">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="8"
                result="blur"
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 31 -12"
                result="cm"
              />
            </filter>
          </defs>
          <g
            className="dot-group"
            transform={`matrix(1,0,0,1,${VIEWBOX_WIDTH / 2},${ICON_SIZE * 2})`}
          >
            <g
              ref={dotContainerRef as RefObject<any>}
              className="dot-container"
              filter="url(#goo)"
            >
              <rect
                className="hit-area"
                width={VIEWBOX_WIDTH}
                transform={`matrix(1,0,0,1,-${DOT_SIZE * 2},-${ICON_SIZE * 2})`}
              />
              {iconPaths.map((icon: { name: string }, index: number) => {
                const { name } = icon
                return (
                  <circle
                    ref={(ref) => {
                      dotRefs.push(ref as any)
                    }}
                    key={index}
                    className="dot"
                    cx={index * SPACER}
                    cy={ICON_SIZE / 2}
                    r={DOT_SIZE}
                    fill={DOT_FILL}
                    id={`dot-${name}-${index}`}
                    onClick={() => {
                      handleClick(index)
                      handleAnimationStart()
                    }}
                  />
                )
              })}
            </g>
            <g
              ref={iconContainerRef as RefObject<any>}
              className="icon-container"
            >
              {iconPaths.map(
                (icon: { name: string; path: string }, index: number) => {
                  const { name, path } = icon
                  return (
                    <path
                      ref={(ref) => {
                        iconRefs.push(ref as any)
                      }}
                      key={index}
                      className="icon"
                      fill={ICON_FILL}
                      id={`icon-${name}-${index}`}
                      data-index={index}
                      d={path}
                      opacity={0}
                      transform={`matrix(1,0,0,1,${
                        index * SPACER - ICON_SIZE / 2
                      },0)`}
                    />
                  )
                }
              )}
            </g>
          </g>
        </svg>
      </Fragment>
    )
  }
)

Svg.displayName = 'Svg'
