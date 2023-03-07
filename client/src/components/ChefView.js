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
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import OutlinedInput from '@mui/material/OutlinedInput'
import axios from 'axios'

export default function ChefView() {
  const [open, setOpen] = useState(false)
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [pizzaToppings, setPizzaToppings] = useState([])
  const [errorMsg, setErrorMsg] = useState('')
  const [formTitle, setFormTitle] = useState('')
  const { toppings, pizzas, setPizzas } = useContext(Context)

  //convert topping ids to topping names
  const displayToppings = (ids) => toppings.filter((tp) => ids.includes(tp._id)).map((tp) => tp.name).join(', ')

  const handleOpen = () => {
    setFormTitle('Create Pizza')
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setId('')
    setErrorMsg('')
    setName('')
    setPizzaToppings([])
  }

  const handleChange = (e) => {
    switch (e.target.name) {
      case 'name':
        setName(e.target.value)
        break
      case 'toppings':
        setPizzaToppings(e.target.value)
        break
      default:
        break
    }
  }
  const handleSubmit = async (e) => {
    if (!name || pizzaToppings.length < 1) {
      setErrorMsg('Please enter pizza name and toppings.')
      return
    }
    try {
      const pizzaData = { name, toppings: pizzaToppings }
      if (id) {
        const { data } = await axios.put(`/api/pizzas/${id}`, pizzaData)
        console.log(data)
        if (data?.modifiedCount === 1) {
          const updatedPizzas = [...pizzas]
          pizzas.forEach((p, idx) => {
            if (p._id === id) {
              updatedPizzas[idx] = { _id: id, ...pizzaData }
            }
          })
          setPizzas(updatedPizzas)
        }
      } else {
        const { data } = await axios.post('/api/pizzas', pizzaData)
        setPizzas((prev) => [...prev, data])
      }
      handleClose()
    } catch (error) {
      setErrorMsg(error.response.data.message)
    }
  }
  const handleEdit = async (pizza) => {
    setFormTitle('Edit Pizza')
    setOpen(true)
    setId(pizza._id)
    setName(pizza.name)
    setPizzaToppings(pizza.toppings)
  }
  const handleDelete = async (id) => {
    const { data } = await axios.delete(`/api/pizzas/${id}`)
    if (data?.deletedCount === 1) {
      const updatedPizzas = pizzas.filter(tp => tp._id !== id)
      setPizzas(updatedPizzas)
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
    <div className='chef-view'>
      <Typography variant='h5' gutterBottom>
        Pizza List
      </Typography>
      <div className='add-pizza'>
        <Button variant='contained' onClick={handleOpen}>Create Pizza</Button>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={modalStyle}>
          <Typography variant='h6' gutterBottom>
            {formTitle}
          </Typography>
          <input hidden type="text" id='pizza-id' name='id' value={id} onChange={handleChange} />
          <FormControl margin='normal' fullWidth>
            <TextField
              required
              id='pizza-name'
              label='Name'
              name='name'
              value={name}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl margin='normal' fullWidth required>
            <InputLabel id='toppings-multi-checkbox-label'>Toppings</InputLabel>
            <Select
              labelId='toppings-multi-checkbox-label'
              id='toppings-multi-checkbox'
              label='Toppings'
              multiple
              name='toppings'
              value={pizzaToppings}
              onChange={handleChange}
              input={<OutlinedInput label="Toppings" />}
              renderValue={(selected) => displayToppings(selected)}

            >
              {toppings.map((tp) => (
                <MenuItem key={tp._id} value={tp._id}>
                  <Checkbox checked={pizzaToppings.indexOf(tp._id) > -1} />
                  <ListItemText primary={tp.name} />
                </MenuItem>
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
              <TableCell>Toppings</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pizzas.map((pizza) => (
              <TableRow key={pizza._id}>
                <TableCell>{pizza._id}</TableCell>
                <TableCell>{pizza.name}</TableCell>
                <TableCell>{displayToppings(pizza.toppings)}</TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton color='primary' onClick={() => handleEdit(pizza)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color='error' onClick={() => handleDelete(pizza._id)}>
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
