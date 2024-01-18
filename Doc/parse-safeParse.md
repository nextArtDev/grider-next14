# Parse and safeParse

## safeParse

```typescript
// valid data
{
   name: 'js',
   description:'a place' 
}

// output for valid data
{
    success:true,
    data:{
        name:'js',
        description:'a place' 
    }
}

    // output for invalid data
    // result.error.flatten().fieldErrors
{
    success:false,
    error:{
        issues:[
            /** object about a failed validation rule */
            /** object about a failed validation rule */
            /** object about a failed validation rule */
        ]
    }
}
```