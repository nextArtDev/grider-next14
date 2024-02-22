# We use SelectGroup if we want to use map method for SelectContent

```typescript
      <Select
        dir="rtl"
        onValueChange={(value) => handleUpdateParams(value)}
      >
        <SelectTrigger>
          <div className=" line-clamp-1 flex-1 pl-4 text-right">
            <SelectValue placeholder="یک فیلتر انتخاب کنید" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {filters.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
```