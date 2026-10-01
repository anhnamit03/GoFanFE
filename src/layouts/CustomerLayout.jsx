import Header from '../components/Header'
import Footer from '../components/Footer'
import Breadcrumb from '../components/Breadcrumb'

function CustomerLayout({ children }) {
  return (
    <div>
      <Header />
      <Breadcrumb />

      <main>
        {children}
      </main>

      <Footer />
    </div>
  )
}

export default CustomerLayout