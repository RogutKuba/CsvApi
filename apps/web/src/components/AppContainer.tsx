interface Props {
  children: React.ReactNode;
}

export const AppContainer = ({ children }: Props) => {
  return (
    <div className='w-full h-full flex justify-center items-center'>
      <div className='w-[65%] h-fit flex flex-col items-center gap-8'>
        {children}
      </div>
    </div>
  );
};
