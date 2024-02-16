import { FC } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ContributorFullStructure } from '@/lib/queries/home/contributors'
import FlipCover from './product/3d-cover/FlipCover'
import Link from 'next/link'

interface RelatedProductsProps {
  contributor: ContributorFullStructure
}

const RelatedProducts: FC<RelatedProductsProps> = ({ contributor }) => {
  let defaultValue

  if (contributor?.writer.length > 0) {
    defaultValue = 'نویسنده'
  } else if (contributor?.Translator.length > 0) {
    defaultValue = 'مترجم'
  } else if (contributor?.editor.length > 0) {
    defaultValue = 'ویراستار'
  } else if (contributor?.photographer.length > 0) {
    defaultValue = 'عکاس'
  } else if (contributor?.illustrator.length > 0) {
    defaultValue = 'تصویرساز'
  }

  return (
    <div>
      <Tabs dir="rtl" defaultValue={defaultValue} className="w-full p-8 ">
        <TabsList>
          {contributor?.writer.length > 0 && (
            <TabsTrigger value="نویسنده">نویسنده</TabsTrigger>
          )}
          {contributor?.Translator.length > 0 && (
            <TabsTrigger value="مترجم">مترجم</TabsTrigger>
          )}
          {contributor?.editor.length > 0 && (
            <TabsTrigger value={'ویراستار'}>ویراستار</TabsTrigger>
          )}
          {contributor?.photographer.length > 0 && (
            <TabsTrigger value={'عکاس'}>عکاس</TabsTrigger>
          )}
          {contributor.illustrator.length > 0 && (
            <TabsTrigger value={'تصویرساز'}>تصویرساز</TabsTrigger>
          )}
        </TabsList>
        {contributor.writer && (
          <TabsContent
            className="flex gap-2 flex-wrap min-w-24  "
            value="نویسنده"
          >
            {contributor.writer.map((writer) => (
              <Link key={writer.id} href={`/products/${writer.id}`}>
                <FlipCover
                  title={writer.title}
                  cover={writer.cover}
                  url={writer.images?.[0].url!}
                />
              </Link>
            ))}
          </TabsContent>
        )}
        {contributor.Translator && (
          <TabsContent
            className="flex gap-2 flex-wrap min-w-24  "
            value="مترجم"
          >
            {contributor.Translator.map((Translator) => (
              <Link key={Translator.id} href={`/products/${Translator.id}`}>
                <FlipCover
                  title={Translator.title}
                  cover={Translator.cover}
                  url={Translator.images?.[0].url!}
                />
              </Link>
            ))}
          </TabsContent>
        )}
        {contributor.editor && (
          <TabsContent
            className="flex gap-2 flex-wrap min-w-24  "
            value="ویراستار"
          >
            {contributor.editor.map((editor) => (
              <Link key={editor.id} href={`/products/${editor.id}`}>
                <FlipCover
                  title={editor.title}
                  cover={editor.cover}
                  url={editor.images?.[0].url!}
                />
              </Link>
            ))}
          </TabsContent>
        )}
        {contributor.photographer && (
          <TabsContent className="flex gap-2 flex-wrap min-w-24  " value="عکاس">
            {contributor.photographer.map((photographer) => (
              <Link key={photographer.id} href={`/products/${photographer.id}`}>
                <FlipCover
                  title={photographer.title}
                  cover={photographer.cover}
                  url={photographer.images?.[0].url!}
                />
              </Link>
            ))}
          </TabsContent>
        )}
        {contributor.illustrator && (
          <TabsContent
            className="flex gap-2 flex-wrap min-w-24  "
            value="تصویرساز"
          >
            {contributor.illustrator.map((illustrator) => (
              <Link key={illustrator.id} href={`/products/${illustrator.id}`}>
                <FlipCover
                  title={illustrator.title}
                  cover={illustrator.cover}
                  url={illustrator.images?.[0].url!}
                />
              </Link>
            ))}
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

export default RelatedProducts
