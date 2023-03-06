import React, { useContext, useState } from 'react'
import { Context } from '../App'
import Table from '@mui/material/Table'
import TableContainer from '@mui/material/TableContainer'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import axios from 'axios'

export default function OwnerView() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const { toppings, setToppings, categories } = useContext(Context)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleChange = (e) => {
    switch (e.target.name) {
      case 'name':
        setName(e.target.value)
        break
      case 'category':
        setCategory(e.target.value)
        break
      default:
        break
    }
  }
  const handleSubmit = async (e) => {
    if (!name || !category) {
      return
    }
    const newTopping = { name, category }
    const { data } = await axios.post('/api/toppings', newTopping)

    setToppings((prev) => [...prev, data])
    setOpen(false)
  }
  const handleDelete = async (id) => {
    const { data } = await axios.delete(`/api/toppings/${id}`)
    if(data?.acknowledged){
      const updated = toppings.filter(tp => tp._id !== id)
      setToppings(updated)
    }
  }
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '550px',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    autoComplete: 'off',
  }

  return (
    <div className='owner-view'>
      <Typography variant='h5' gutterBottom>
        Topping List
      </Typography>
      <div className='add-topping'>
        <Button variant='contained' onClick={handleOpen}>Add Topping</Button>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={modalStyle}>
          <Typography variant='h6' gutterBottom>
            Add Topping
          </Typography>
          <FormControl margin='normal' fullWidth>
            <TextField
              required
              id='outlined-required'
              label='Name'
              name='name'
              defaultValue=''
              onChange={handleChange}
            />
          </FormControl>
          <FormControl margin='normal' fullWidth required>
            <InputLabel id='topping-category-label'>Category</InputLabel>
            <Select
              labelId='topping-category-label'
              id='topping-category'
              label='Category'
              name='category'
              defaultValue=''
              onChange={handleChange}
            >
              <MenuItem value=''></MenuItem>
              {categories.map((cat, idx) => (
                <MenuItem value={cat} key={idx}>{cat}</MenuItem>
              ))}
            </Select>
            <div className='form-btns'>
              <Button variant='contained' onClick={handleSubmit}>ADD</Button>
              <Button variant='contained' onClick={handleClose}>CANCEL</Button>
            </div>
          </FormControl>
        </Box>
      </Modal>
      <TableContainer sx={{ maxHeight: '70vh' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {toppings.map((tp, idx) => (
              <TableRow key={idx}>
                <TableCell>{tp._id}</TableCell>
                <TableCell>{tp.name}</TableCell>
                <TableCell>{tp.category}</TableCell>
                <TableCell>
                  <IconButton color='error' onClick={() => handleDelete(tp._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
