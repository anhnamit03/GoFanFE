import Header from '../components/Header'

function CustomerLayout({ children }) {
  return (
    <div>
      <Header />

      <main>
        {children}
      </main>

      <footer>
        <p>GoFan</p>
      </footer>
    </div>
  )
}

export default CustomerLayout