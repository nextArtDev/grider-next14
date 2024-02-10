# Card Parallax

first we define card position _sticky_ and to make the sticky work  we set _top:0_

```typescript
.cardContainer {
    position: sticky;
    top: 0px;
}
```

then we get the main of root, styling:

```typescript
margin-top: 50vh;
```

now we have main with some margin, and all the card containers at the bottom,

when the card reaches the 50vh of the main page, it sticks and others too. _because sticky position is based on the main_

if we get a margin bottom to the main, because they're sticky in proportion with main, the whole would goes up after reaching the bottom.

we have three animations here:

## scaling down image

Image container has _overflow: hidden_ so we can scale up and down inner image:

```typescript

const container = useRef(null)
  const { scrollYProgress } = useScroll({
    // scrollYProgress is between 0-1 depending where the container is according to the window.
    target: container,
    // when we want to start tracking the container: start of the container and the end of the window, as soon as the card container enter into view we want to track the scroll
    // we want to stop the track of the container when the card container reaches top of the window, which is start of the container and start of the window
    offset: ['start end', 'start start'],
  })

// we initially want bigger scale (2) then scale 1
  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1])
   <div ref={container} className={styles.cardContainer}>
   //...
        <div className={styles.imageContainer}>

           <motion.div className={styles.inner} style={{ scale: imageScale }}>
             <Image fill src={`/parallax-images/${src}`} alt="image" />
           </motion.div>
         </div>
```

## stacking animation as we scroll 

first we should change the _top_ property of every single card, we set a _dynamic top position using the index of each card_

```typescript
// page.tsx

// passing the index of the card down 
 {projects.map((project, i) => {
        return (
          <Card
            i={i}
           //...
          />
        )
      })}


// card.tsx

 return (
    <div ref={container} className={styles.cardContainer}>
      <motion.div
        style={{
//..
// Every single card will have a different top position -10, -10+25, -10+50,..
          top: `calc(-5vh + ${i * 25}px)`,
        }}
 
      >
```

## Scale every single card as scrolling

we just repeat the scaling process but at the root, page.tsx

- range: when we want to start the scaling, when the card reaches the sticky position. the range of scrollY progress when we want to animate the card

- targetScale: every single card wont have the same scaling, the first one get more scale than the last one. all the cards have a different target scale

```typescript
 const container = useRef(null)
  const { scrollYProgress } = useScroll({
    target: container,
    // start-start: we want to first scaling happen at the beginning
    // end-end: when the end of the main container reaches the end of the window 
    offset: ['start start', 'end end'],
  })

   return (
    <main ref={container} className="relative mt-[50vh]">
      {projects.map((project, i) => {
        // starts at 1, and reduced by 4-i (the last one doesn't scale down) * 0.05
        const targetScale = 1 - (projects.length - i) * 0.05
        return (
          <Card
            key={`p_${i}`}
            i={i}
            {...project}
            progress={scrollYProgress}
            // end is one, because we start animation when the card reaches the sticky position
            // start: index is between 0 - 4, we divide 100/4 is 25% is the range of the first card for 0 to 1, second 0.25 to 1, .. 
            range={[i * 0.25, 1]}
            targetScale={targetScale}
          />
        )
      })}
    </main>
  )

  // Card.tsx

  const scale = useTransform(progress, range, [1, targetScale])

   return (
    <div ref={container} className={styles.cardContainer}>
      <motion.div
        style={{
          scale,
        }}
      >
```