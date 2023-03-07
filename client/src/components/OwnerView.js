import React, { useContext, useState } from 'react'
import { Context } from '../App'
import Table from '@mui/material/Table'
import TableContainer from '@mui/material/TableContainer'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
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
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const { toppings, setToppings, categories } = useContext(Context)
  const [formTitle, setFormTitle] = useState('')

  const handleOpen = () => {
    setFormTitle('Create Topping')
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
    setId('')
    setErrorMsg('')
    setName('')
    setCategory('')
  }

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
      setErrorMsg('Please enter topping name and category.')
      return
    }
    try {
      const toppingData = { name, category }
      if (id) {
        const { data } = await axios.put(`/api/toppings/${id}`, toppingData)
        console.log(data)
        if (data?.modifiedCount === 1) {
          const updatedToppings = [...toppings]
          toppings.forEach((tp, idx) => {
            if (tp._id === id) {
              updatedToppings[idx] = { _id: id, ...toppingData }
            }
          })
          setToppings(updatedToppings)
        }
      } else {
        const { data } = await axios.post('/api/toppings', toppingData)
        setToppings((prev) => [...prev, data])
      }
      handleClose()
    } catch (error) {
      setErrorMsg(error.response.data.message)
    }
  }
  const handleEdit = async (topping) => {
    setFormTitle('Edit Topping')
    setOpen(true)
    setId(topping._id)
    setName(topping.name)
    setCategory(topping.category)
  }
  const handleDelete = async (id) => {
    const { data } = await axios.delete(`/api/toppings/${id}`)
    if (data?.deletedCount === 1) {
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
            {formTitle}
          </Typography>
          <input hidden type="text" id='topping-id' name='id' value={id} onChange={handleChange} />
          <FormControl margin='normal' fullWidth>
            <TextField
              required
              id='outlined-required'
              label='Name'
              name='name'
              value={name}
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
              value={category}
              onChange={handleChange}
            >
              <MenuItem value=''></MenuItem>
              {categories.map((cat, idx) => (
                <MenuItem value={cat} key={idx}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <div className='form-btns'>
            <Button variant='contained' onClick={handleSubmit}>SUBMIT</Button>
            <Button variant='contained' onClick={handleClose}>CANCEL</Button>
          </div>
          {errorMsg && <Typography variant="caption" display="block" color='error'>
            * {errorMsg}
          </Typography>}
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
                  <Tooltip title="Edit">
                    <IconButton color='primary' onClick={() => handleEdit(tp)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color='error' onClick={() => handleDelete(tp._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
