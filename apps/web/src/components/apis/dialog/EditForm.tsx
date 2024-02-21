import { Checkbox } from '@billing/ui/src/components/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@billing/ui/src/components/form';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { Dropzone } from '@billing/ui/src/components/dropzone';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@billing/ui/src/components/select';
import { Label } from '@billing/ui/src/components/label';
import { Typography } from '@billing/ui/src/components/typography';

export const EditFormSchema = z.object({
  fieldDelimeterSpace: z.boolean(),
  file: z.array(z.object({ name: z.string(), url: z.string() })),
  schema: z.array(z.object({ field: z.string(), type: z.string() })),
});

interface Props {
  form: UseFormReturn<z.infer<typeof EditFormSchema>>;
}

export const EditForm = ({ form }: Props) => {
  return (
    <Form {...form}>
      <form className='space-y-8'>
        <FormField
          control={form.control}
          name='file'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload file</FormLabel>
              <FormControl>
                <Dropzone
                  onChange={(newFiles) => {
                    field.onChange(newFiles);
                  }}
                  maxFiles={1}
                  fileExtensions={['text/csv']}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='fieldDelimeterSpace'
          render={({ field }) => (
            <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className='space-y-1 leading-none'>
                <FormLabel>Include space between values</FormLabel>
                <FormDescription>
                  Select if your csv file has a space between values e.x
                  (value1, value2) and NOT (value1,value2)
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='schema'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data schema</FormLabel>

              {field.value.map((schema, index) => (
                <div
                  key={index}
                  className='flex flex-row justify-between items-center w-full'
                >
                  <Typography.p>{schema.field}</Typography.p>
                  <FormControl>
                    <Select
                      value={schema.type}
                      onValueChange={(v) => {
                        field.onChange([
                          ...field.value.slice(0, index),
                          { ...field.value[index], type: v },
                          ...field.value.slice(index + 1),
                        ]);
                      }}
                    >
                      <SelectTrigger className='w-[180px]'>
                        <SelectValue placeholder='Select a datatype' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='string'>String</SelectItem>
                        <SelectItem value='int'>Int</SelectItem>
                        <SelectItem value='float'>Float</SelectItem>
                        <SelectItem value='bool'>Boolean</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </div>
              ))}
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
