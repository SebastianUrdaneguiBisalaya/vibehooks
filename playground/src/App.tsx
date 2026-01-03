import { useScreenSize } from '../../src'

export function App() {
  const size = useScreenSize();
  return (
    <div className='container'>
      <h1>{size.width}</h1>
    </div>
  )
}
