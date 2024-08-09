'use client'
import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  borderRadius: 2,
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [filteredInventory, setFilteredInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const updateInventory = async () => {
    try {
      const snapshot = query(collection(firestore, 'inventory'))
      const docs = await getDocs(snapshot)
      const inventoryList = []
      docs.forEach((doc) => {
        inventoryList.push({ name: doc.id, ...doc.data() })
      })
      setInventory(inventoryList)
      setFilteredInventory(inventoryList) // Initially set filtered inventory to all items
    } catch (error) {
      console.error("Error updating inventory:", error)
    }
  }

  const addItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const { quantity } = docSnap.data()
        await setDoc(docRef, { quantity: quantity + 1 })
      } else {
        await setDoc(docRef, { quantity: 1 })
      }
      await updateInventory()
    } catch (error) {
      console.error("Error adding item:", error)
    }
  }
  
  const removeItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const { quantity } = docSnap.data()
        if (quantity === 1) {
          await deleteDoc(docRef)
        } else {
          await setDoc(docRef, { quantity: quantity - 1 })
        }
      }
      await updateInventory()
    } catch (error) {
      console.error("Error removing item:", error)
    }
  }

  const incrementItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const { quantity } = docSnap.data()
        await setDoc(docRef, { quantity: quantity + 1 })
      }
      await updateInventory()
    } catch (error) {
      console.error("Error incrementing item:", error)
    }
  }
  
  useEffect(() => {
    updateInventory()
  }, [])

  useEffect(() => {
    // Filter inventory based on search query
    setFilteredInventory(
      inventory.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
  }, [searchQuery, inventory])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
      sx={{ bgcolor: '#f5f5f5' }}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add New Item
      </Button>
      <TextField
        id="search-bar"
        label="Search Inventory"
        variant="outlined"
        fullWidth
        sx={{ maxWidth: '800px', marginBottom: 2 }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Box
        sx={{
          border: '1px solid #333',
          borderRadius: 2,
          overflow: 'hidden',
          width: '90%',
          maxWidth: '800px',
        }}
      >
        <Box
          width="100%"
          bgcolor={'#1976d2'}
          color={'#fff'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          padding={2}
        >
          <Typography variant={'h4'} textAlign={'center'}>
            Inventory Items
          </Typography>
        </Box>
        <Stack
          width="100%"
          spacing={2}
          padding={2}
          maxHeight="400px"
          overflow={'auto'}
          sx={{ bgcolor: '#fff' }}
        >
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
              padding={2}
              borderRadius={1}
              boxShadow={1}
            >
              <Typography variant={'h6'} textAlign={'center'}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={'h6'} textAlign={'center'}>
                Quantity: {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button variant="contained" color="primary" onClick={() => incrementItem(name)}>
                  Add
                </Button>
                <Button variant="contained" color="secondary" onClick={() => removeItem(name)}>
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
