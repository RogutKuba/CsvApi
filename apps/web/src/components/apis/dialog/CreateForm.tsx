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

export const CreateFormSchema = z.object({
  fieldDelimeterSpace: z.boolean(),
  file: z.array(z.object({ name: z.string(), url: z.string() })),
});

interface Props {
  form: UseFormReturn<z.infer<typeof CreateFormSchema>>;
}

export const CreateForm = ({ form }: Props) => {
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
      </form>
    </Form>
  );
};
