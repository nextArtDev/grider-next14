import { SingleProductFullStructure } from '@/lib/queries/home/products'
import { FC } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { translateCover, translateSize } from '@/lib/utils'

interface ProductTableProps {
  product: SingleProductFullStructure
}

const ProductTable: FC<ProductTableProps> = ({ product }) => {
  return (
    <div dir="rtl" className="bg-secondary rounded-md p-4  mx-8  ">
      <Table>
        {/* <TableCaption>مشخصات کتاب.</TableCaption> */}
        <TableHeader>
          {/* <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-left">Amount</TableHead>
          </TableRow> */}
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">شابک:</TableCell>
            <TableCell className="text-left">{product.isbn}</TableCell>
          </TableRow>
          {/* <TableRow>
            <TableCell className="font-medium">تاریخ چاپ:</TableCell>
            <TableCell className="text-left">{product.publishDate}</TableCell>
          </TableRow> */}
          <TableRow>
            <TableCell className="font-medium">تعداد صفحات</TableCell>
            <TableCell className="text-left">{product.pages}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">وزن (گرم)</TableCell>
            <TableCell className="text-left">{product.weight}</TableCell>
          </TableRow>
          {product.editor.length > 0 && (
            <TableRow>
              <TableCell className="font-medium">ویراستار</TableCell>
              <TableCell className="text-left">
                {product.editor.map((editor) => editor.name).join(' و ')}
              </TableCell>
            </TableRow>
          )}
          {!!product.cover && (
            <TableRow>
              <TableCell className="font-medium">نوع جلد</TableCell>
              <TableCell className="text-left">
                {translateCover(product.cover)}
              </TableCell>
            </TableRow>
          )}
          {!!product.size && (
            <TableRow>
              <TableCell className="font-medium"> قطع</TableCell>
              <TableCell className="text-left">
                {translateSize(product.size)}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default ProductTable
