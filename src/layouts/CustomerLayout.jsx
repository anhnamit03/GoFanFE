import Header from '../components/Header'
import Footer from '../components/Footer'

function CustomerLayout({ children }) {
  return (
    <div>
      <Header />

      <main>
        {children}
      </main>

      <Footer />
    </div>
  )
}

export default CustomerLayout