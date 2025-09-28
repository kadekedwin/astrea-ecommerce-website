'use client'

import { useState, useEffect } from 'react'

interface Product {
  id: number
  name: string
  slug: string
  price: number
  originalPrice?: number
  stock: number
  category: number
  rating: number
  reviews: number
  description: string
  img: string
  badge?: string
}

interface Category {
  id: number
  name: string
  slug: string
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState('products')
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [productForm, setProductForm] = useState({
    name: '',
    slug: '',
    price: '',
    originalPrice: '',
    stock: '',
    category: '',
    rating: '',
    reviews: '',
    description: '',
    img: '',
    badge: ''
  })
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: ''
  })

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  useEffect(() => {
    if (editingProduct) {
      setTimeout(() => {
        const formElement = document.getElementById('product-form')
        if (formElement) {
          formElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          })
        }
      }, 100)
    }
  }, [editingProduct])

  useEffect(() => {
    if (editingCategory) {
      setTimeout(() => {
        const formElement = document.getElementById('category-form')
        if (formElement) {
          formElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          })
        }
      }, 100)
    }
  }, [editingCategory])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoadingProducts(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoadingCategories(false)
    }
  }

  const handleProductInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProductForm({ ...productForm, [name]: value })
  }

  const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCategoryForm({ ...categoryForm, [name]: value })
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const formData = { ...productForm }
      if (!formData.slug) {
        formData.slug = formData.name.toLowerCase().replace(/\s+/g, '-')
      }
      if (editingProduct) {
        await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
      } else {
        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
      }
      fetchProducts()
      setEditingProduct(null)
      setProductForm({ name: '', slug: '', price: '', originalPrice: '', stock: '', category: '', rating: '', reviews: '', description: '', img: '', badge: '' })
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Error saving product')
    }
  }

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const formData = { ...categoryForm }
      if (!formData.slug) {
        formData.slug = formData.name.toLowerCase().replace(/\s+/g, '-')
      }
      if (editingCategory) {
        await fetch(`/api/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
      } else {
        await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
      }
      fetchCategories()
      setEditingCategory(null)
      setCategoryForm({ name: '', slug: '' })
    } catch (error) {
      console.error('Error saving category:', error)
      alert('Error saving category')
    }
  }

  const handleProductEdit = (product: Product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      slug: product.slug,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      stock: product.stock.toString(),
      category: product.category.toString(),
      rating: product.rating.toString(),
      reviews: product.reviews.toString(),
      description: product.description,
      img: product.img,
      badge: product.badge || ''
    })
  }

  const handleCategoryEdit = (category: Category) => {
    setEditingCategory(category)
    setCategoryForm({
      name: category.name,
      slug: category.slug
    })
  }

  const handleProductDelete = async (id: number) => {
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' })
      fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const handleCategoryDelete = async (id: number) => {
    try {
      await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      fetchCategories()
      fetchProducts()
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }

  const handleCategoryCancel = () => {
    setEditingCategory(null)
    setCategoryForm({ name: '', slug: '' })
  }

  const handleProductCancel = () => {
    setEditingProduct(null)
    setProductForm({ name: '', slug: '', price: '', originalPrice: '', stock: '', category: '', rating: '', reviews: '', description: '', img: '', badge: '' })
  }

  const handleImageUpload = async (file: File): Promise<string | null> => {
    console.log('🚀 Starting image upload...')
    console.log('📁 File details:', {
      name: file?.name,
      size: file?.size,
      type: file?.type
    })
    
    if (!file) {
      console.log('❌ No file provided')
      return null
    }

    setUploadingImage(true)
    
    try {
      console.log('📤 Creating FormData...')
      const formData = new FormData()
      formData.append('image', file)
      console.log('✅ FormData created successfully')

      console.log('🌐 Making fetch request to /api/upload...')
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      
      console.log('📡 Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      })

      // Check content type before parsing
      const contentType = response.headers.get('content-type')
      console.log('📋 Response content-type:', contentType)
      
      if (!contentType || !contentType.includes('application/json')) {
        console.log('⚠️ Response is not JSON!')
        const textResponse = await response.text()
        console.log('📄 Raw response text:', textResponse.substring(0, 500))
        throw new Error(`Server returned non-JSON response. Content-Type: ${contentType}`)
      }

      if (!response.ok) {
        console.log('❌ Response not OK, attempting to parse error...')
        try {
          const errorData = await response.json()
          console.log('🔍 Error data:', errorData)
          throw new Error(errorData.error || `HTTP ${response.status}: Upload failed`)
        } catch (parseError) {
          console.log('❌ Failed to parse error response:', parseError)
          throw new Error(`HTTP ${response.status}: Upload failed`)
        }
      }

      console.log('✅ Response OK, parsing JSON...')
      const data = await response.json()
      console.log('📊 Upload response data:', data)
      
      if (!data.url) {
        console.log('⚠️ No URL in response data')
        throw new Error('No URL returned from upload')
      }
      
      console.log('🎉 Upload successful! URL:', data.url)
      return data.url
      
    } catch (error) {
      console.error('💥 Upload error occurred:', error)
      console.error('🔍 Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : 'No stack trace'
      })
      
      // More specific error messages
      let alertMessage = 'Error uploading image: '
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        alertMessage += 'Network error - could not connect to server'
      } else if (error instanceof Error && error.message.includes('JSON')) {
        alertMessage += 'Server returned invalid response (not JSON)'
      } else if (error instanceof Error && error.message.includes('non-JSON')) {
        alertMessage += 'Server returned HTML instead of JSON - check API endpoint'
      } else {
        alertMessage += error instanceof Error ? error.message : 'Unknown error'
      }
      
      alert(alertMessage)
      return null
      
    } finally {
      console.log('🏁 Upload process finished')
      setUploadingImage(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = await handleImageUpload(file)
      if (url) {
        setProductForm({ ...productForm, img: url })
        e.target.value = ''
      }
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Kelola produk dan kategori toko online Anda</p>
      </div>

      <div className="mb-8 animate-slide-down">
        <div className="bg-white rounded-xl shadow-sm p-2 inline-flex">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'products'
                ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Produk
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'categories'
                ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Kategori
          </button>
        </div>
      </div>
      {activeTab === 'products' && (
        <div>
          {loadingProducts ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm animate-fade-in">
              <div className="animate-pulse-glow mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Memuat produk...</h3>
              <p className="text-gray-500">Mohon tunggu sebentar</p>
            </div>
          ) : (
            <>
              <form id="product-form" onSubmit={handleProductSubmit} className={`mb-8 bg-white rounded-xl shadow-sm p-6 animate-fade-in transition-all duration-300 ${editingProduct ? 'ring-2 ring-blue-500 ring-opacity-50 shadow-lg' : ''}`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={editingProduct ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h2 className="text-xl font-semibold text-gray-900">{editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
                        {editingProduct && (
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                            Mode Edit
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">{editingProduct ? 'Perbarui informasi produk' : 'Masukkan detail produk baru'}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Nama Produk *</label>
                    <input
                      type="text"
                      name="name"
                      value={productForm.name}
                      onChange={handleProductInputChange}
                      placeholder="Masukkan nama produk"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white transition-all duration-300 focus:shadow-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Slug</label>
                    <input
                      type="text"
                      name="slug"
                      value={productForm.slug}
                      onChange={handleProductInputChange}
                      placeholder="nama-produk"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white transition-all duration-300 focus:shadow-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Harga *</label>
                    <input
                      type="number"
                      name="price"
                      value={productForm.price}
                      onChange={handleProductInputChange}
                      placeholder="0"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white transition-all duration-300 focus:shadow-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Harga Asli</label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={productForm.originalPrice}
                      onChange={handleProductInputChange}
                      placeholder="0"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white transition-all duration-300 focus:shadow-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Stok *</label>
                    <input
                      type="number"
                      name="stock"
                      value={productForm.stock}
                      onChange={handleProductInputChange}
                      placeholder="0"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white transition-all duration-300 focus:shadow-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Kategori *</label>
                    <select
                      name="category"
                      value={productForm.category}
                      onChange={handleProductInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white transition-all duration-300 focus:shadow-lg"
                    >
                      <option value="">Pilih Kategori</option>
                      {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Rating</label>
                    <input
                      type="number"
                      step="0.1"
                      name="rating"
                      value={productForm.rating}
                      onChange={handleProductInputChange}
                      placeholder="0.0"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white transition-all duration-300 focus:shadow-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Ulasan</label>
                    <input
                      type="number"
                      name="reviews"
                      value={productForm.reviews}
                      onChange={handleProductInputChange}
                      placeholder="0"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white transition-all duration-300 focus:shadow-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Badge</label>
                    <input
                      type="text"
                      name="badge"
                      value={productForm.badge}
                      onChange={handleProductInputChange}
                      placeholder="Diskon 20%"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white transition-all duration-300 focus:shadow-lg"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Gambar Produk</label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          disabled={uploadingImage}
                          className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                        />
                        {uploadingImage && (
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 animate-spin text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span className="text-sm text-gray-600">Uploading...</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">Maksimal 5MB. Format: JPEG, PNG, WebP</p>
                      {productForm.img && (
                        <div className="mt-3">
                          <label className="block text-xs text-gray-600 mb-2">Pratinjau:</label>
                          <div className="relative inline-block">
                            <img
                              src={productForm.img}
                              alt="Preview"
                              className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                              onError={(e) => {
                                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDMTMuMSAyIDE0IDIuOSAxNCA0VjE2QzE0IDE3LjEgMTMuMSAxOCA5LjkgMTlIMTQuMUMxNS4xIDE5IDE2IDE4LjEgMTYgMTdWNFoiIGZpbGw9IiM5Q0E0QUYiLz4KPHBhdGggZD0iTTEwIDJDOS45IDIgOSA0LjkgOSA2VjE2QzkgMTYuMSAxMC4xIDE3IDEwIDE3VjJDMTAgMiAxMCAyIDEwIDJaIiBmaWxsPSIjOUNBNEFGIi8+CjxwYXRoIGQ9Ik0xNCAyQzE0IDIgMTQgMiAxNCAyVjJDMTQgMiAxNCAyIDE0IDJaIiBmaWxsPSIjOUNBNEFGIi8+Cjwvc3ZnPgo='
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => setProductForm({ ...productForm, img: '' })}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                    <textarea
                      name="description"
                      value={productForm.description}
                      onChange={handleProductInputChange}
                      placeholder="Deskripsikan produk Anda..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white transition-all duration-300 focus:shadow-lg"
                      rows={4}
                    ></textarea>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 hover:shadow-lg font-medium"
                  >
                    {editingProduct ? 'Perbarui Produk' : 'Tambah Produk'}
                  </button>
                  {editingProduct && (
                    <button
                      type="button"
                      onClick={handleProductCancel}
                      className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-all duration-300 font-medium"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </form>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-fade-in">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Daftar Produk</h3>
                  <p className="text-gray-600 text-sm">Kelola semua produk dalam katalog</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-200 animate-fade-in">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img className="h-10 w-10 rounded-lg object-cover" src={product.img} alt={product.name} />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                <div className="text-sm text-gray-500">{product.slug}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="font-medium">Rp {product.price.toLocaleString()}</div>
                            {product.originalPrice && (
                              <div className="text-gray-500 line-through">Rp {product.originalPrice.toLocaleString()}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              product.stock > 10
                                ? 'bg-green-100 text-green-800'
                                : product.stock > 0
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {categories.find(c => c.id == product.category)?.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <span className="text-yellow-400 mr-1">★</span>
                              {product.rating} ({product.reviews})
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleProductEdit(product)}
                                className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-all duration-300 text-xs font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleProductDelete(product.id)}
                                className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-all duration-300 text-xs font-medium"
                              >
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}
      {activeTab === 'categories' && (
        <div>
          {loadingCategories ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm animate-fade-in">
              <div className="animate-pulse-glow mb-6">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Memuat kategori...</h3>
              <p className="text-gray-500">Mohon tunggu sebentar</p>
            </div>
          ) : (
            <>
              <form id="category-form" onSubmit={handleCategorySubmit} className={`mb-8 bg-white rounded-xl shadow-sm p-6 animate-fade-in transition-all duration-300 ${editingCategory ? 'ring-2 ring-green-500 ring-opacity-50 shadow-lg' : ''}`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-3 rounded-lg mr-4">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={editingCategory ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h2 className="text-xl font-semibold text-gray-900">{editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}</h2>
                        {editingCategory && (
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                            Mode Edit
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">{editingCategory ? 'Perbarui informasi kategori' : 'Masukkan detail kategori baru'}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Nama Kategori *</label>
                    <input
                      type="text"
                      name="name"
                      value={categoryForm.name}
                      onChange={handleCategoryInputChange}
                      placeholder="Masukkan nama kategori"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white transition-all duration-300 focus:shadow-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Slug</label>
                    <input
                      type="text"
                      name="slug"
                      value={categoryForm.slug}
                      onChange={handleCategoryInputChange}
                      placeholder="nama-kategori"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white transition-all duration-300 focus:shadow-lg"
                    />
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-300 hover:shadow-lg font-medium"
                  >
                    {editingCategory ? 'Perbarui Kategori' : 'Tambah Kategori'}
                  </button>
                  {editingCategory && (
                    <button
                      type="button"
                      onClick={handleCategoryCancel}
                      className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-all duration-300 font-medium"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </form>

              <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-fade-in">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Daftar Kategori</h3>
                  <p className="text-gray-600 text-sm">Kelola semua kategori produk</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {categories.map((category) => (
                        <tr key={category.id} className="hover:bg-gray-50 transition-colors duration-200 animate-fade-in">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                              </div>
                              <div className="text-sm font-medium text-gray-900">{category.name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.slug}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleCategoryEdit(category)}
                                className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-all duration-300 text-xs font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleCategoryDelete(category.id)}
                                className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-all duration-300 text-xs font-medium"
                              >
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}