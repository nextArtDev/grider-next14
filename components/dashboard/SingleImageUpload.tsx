// 'use client'

// // import { CldUploadWidget } from 'next-cloudinary'
// import { ChangeEvent, useEffect, useState } from 'react'

// import { Button, buttonVariants } from '@/components/ui/button'
// import Image from 'next/image'
// import { ImagePlus, Trash, UploadCloud } from 'lucide-react'
// import { useFormState } from 'react-dom'
// import { upImage } from '@/lib/actions/dashboard/category'
// import { cn } from '@/lib/utils'

// interface SingleImageUploadProps {
//   disabled?: boolean
//   onChange: (value: string) => void
//   onRemove: (value: string) => void
//   value: string[] //Number of images or if 'const files = Array.from(event.target.files!)' --> files
//   assignId: string
//   multiple: boolean
// }

// const SingleImageUpload: React.FC<SingleImageUploadProps> = ({
//   disabled,
//   onChange,
//   onRemove,
//   value: formValue,
//   assignId,
//   multiple,
// }) => {
//   const [isMounted, setIsMounted] = useState(false)

//   useEffect(() => {
//     setIsMounted(true)
//   }, [])

//   // const onUpload = (result: any) => {
//   //   onChange(result.info.secure_url)
//   // }
//   const [urls, setUrls] = useState<string[]>([])
//   const [files, setFiles] = useState('')

//   const [imageFormState, uploadAction] = useFormState(upImage, {
//     errors: {},
//     success: '',
//   })

//   //   const handleFilesChange = async (event: ChangeEvent<HTMLInputElement>) => {
//   //     const files = Array.from(event.target.files!)
//   //     if (files.length < 1) return
//   //     // console.log(files.length)

//   //     for (let index = 0; index < files.length; index++) {
//   //       const value = files[index]
//   //       console.log(value)
//   //       //@ts-ignore
//   //       const url = await uploadToS3(value)
//   //       onChange(url!)
//   //       setUrls((current: any) => [...current, url])
//   //     }
//   //   }

//   //   const onDelete = async (url: string) => {
//   //     const res = await deleteFromS3(url)
//   //     onRemove(url)
//   //     // console.log(res)
//   //   }

//   //its place is important and it should be after onUpload to does not break it
//   if (!isMounted) {
//     return null
//   }

//   return (
//     <div>
//       <div className="mb-4 flex items-center gap-4">
//         {/* Iterating over Url of different image */}
//         {urls.map((url) => (
//           <div
//             key={url}
//             className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
//           >
//             <div className="z-10 absolute top-2 right-2">
//               <Button
//                 type="button"
//                 // onClick={() => onDelete(url)}
//                 variant="destructive"
//                 size="sm"
//               >
//                 <Trash className="h-4 w-4" />
//               </Button>
//             </div>
//             <Image fill className="object-cover" alt="Image" src={url} />
//           </div>
//         ))}
//       </div>
//       {/* <Button
//         type="button"
//         disabled={disabled}
//         variant="secondary"
//         onClick={() => (formValue = [...urls])}
//       >
//         <input
//           // hidden
//           type="file"
//           name="file"
//           multiple={true}
//           onChange={handleFilesChange}
//         />
//         <ImagePlus className="h-4 w-4 mr-2" />
//       </Button>  */}

//       <form action={uploadAction}>
//         <label
//           htmlFor="image"
//           className={cn(
//             'max-w-md mx-auto cursor-pointer bg-transparent rounded-xl flex flex-col justify-center gap-4 items-center border-2 border-black/20 dark:border-white/20 border-dashed w-full h-24 shadow ',
//             files.length > 0 ? 'hidden' : ''
//           )}
//         >
//           <span
//             className={cn(
//               buttonVariants({ variant: 'ghost' }),

//               'flex flex-col items-center justify-center gap-2 h-64 w-full'
//             )}
//           >
//             <UploadCloud />
//             انتخاب عکس
//           </span>
//         </label>
//         <input
//           name="image"
//           id="image"
//           className="hidden"
//           type="file"
//           onChange={(e) => {
//             const file = e.target.files ? e.target.files[0] : null
//             if (file) {
//               //   form.setValue('image', URL.createObjectURL(file))
//               setFiles(URL.createObjectURL(file))
//             }
//           }}
//         />
//       </form>
//     </div>
//   )
// }

// export default SingleImageUpload
