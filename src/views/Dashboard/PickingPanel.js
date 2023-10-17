import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ReactSearchAutocomplete } from 'react-search-autocomplete'

import BarcodeScannerComponent from "react-qr-barcode-scanner";

// Chakra imports
import {
  Flex,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  Input,
  Td,
  Badge,
  Button,
  useColorModeValue,
  SimpleGrid,
  Spacer,
  InputGroup,
  IconButton,
  InputLeftElement,
  InputRightElement
} from "@chakra-ui/react";

import { NavLink } from "react-router-dom";

const activeRoute = (routeName) => {
  return window.location.href.indexOf(routeName) > -1 ? true : false;
};

// Custom components
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Search from "components/Navbars/SearchBar/Search.js";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";

import { CartIcon } from "components/Icons/Icons.js";

import axios from 'axios';
import { FaWeight } from "react-icons/fa";

let count = 0;

function PickingPanel() {

  const [data, setData] = React.useState("Not Found");
  const textColor = useColorModeValue("gray.700", "white");
  const bgStatus = useColorModeValue("gray.400", "#1a202c");
  const colorStatus = useColorModeValue("white", "gray.400");
  const mainTeal = useColorModeValue("teal.300", "teal.300");
  const searchIconColor = useColorModeValue("gray.700", "gray.200");
  const inputBg = useColorModeValue("white", "gray.800");
  const [order, setOrder] = useState();
  const [orderCodeValidation, setOrderCodeValidation] = useState(0);
  const [products, setProducts] = useState([]);
  const [picking, setPicking] = useState([]);
  const [product, setProduct] = useState();
  const [productsSelected, setProductsSelected] = useState([]);
  const [showScanner, setShowScanner] = useState(0);
  const [value, setValue] = useState(0);
  const [manualCode, setManualCode] = useState('');

  const min = 1;
  const max = 100;




  const  { reference, sku } = useParams();
  const buttonRef = useRef(true);
  const quantityRef = useRef(true);

  useEffect(() => {
    getOrderDetails();
    updatePickingTable();
   }, []);


 
 
   const handleChange = event => {
     const value = Math.max(min, Math.min(max, Number(event.target.value)));
     setValue(value);
   };

   const handleOnSearch = (string, results) => {
    // onSearch will have as the first callback parameter
    // the string searched and for the second the results.
    console.log(string, results)
  }

  const handleOnHover = (result) => {
    // the item hovered
    // console.log(result)
  }

  function find_sku(product){
    
    if(productsSelected.find(product.code)) return product;
  }

  const handleOnSelect = (item) => {
    // the item selected

    setProductsSelected(current => [...current, item]);

    const id = products.findIndex(p => p.code ===  item.code);
    products.splice(id, 1); 

  }



  const handleOnFocus = () => {
    console.log('Focused')
  }

  const formatResult = (item) => {
    return (
      <>
        <span style={{ display: 'block', textAlign: 'left' }}>SKU: {item.code}</span>
        <span style={{ display: 'block', textAlign: 'left' }}>{item.name}</span>
      </>
    )
  }


  const getOrderDetails = async () => {
    count = 0;
    setValue(count);

    const formData = new FormData();
    formData.append('reference', reference);
    formData.append('sku', sku);

    await axios.get(`http://127.0.0.1:5000/api/picking/`+reference+`/`+sku).then(({data})=>{


       console.log(data);


        let item = {
            code: data.product_data.code,
            name: data.product_data.title,
            quantity: data.product_data.quantity
        };

        setProducts(current => [...current, item]);
        
       setOrder(data.order);
       //  setProducts(data.products);
        setProduct(data.product_data);


    })

  }
  
  const removeProduct = ((code) => {

    console.log(code);
    const id = productsSelected.findIndex(p => p.code ===  code);
    console.log("id: "+id);

    productsSelected.splice(id, 1); 

  });

  const managePicking = async () => {

    const bodyFormData = new FormData();

    productsSelected.forEach((item) => {
        bodyFormData.append('products[]', item.code);
    });


    await axios.post('http://127.0.0.1:5000/api/orders/'+reference, bodyFormData).then(({data})=>{

      console.log(data);

   })

  }

  const productTitle = () => {

    return product.title;

  }

  const show_scanner = () => {

      if(showScanner){
        setShowScanner(0);
      }else{
        setShowScanner(1);
      }
  }


  const scan = (result) => {
  

    if (result) {
      
      setData(result.text);
      if(count<product.quantity){
        count++;
        console.log("Scanneado: "+count);
        setValue(count);
        
        quantityRef.current.disabled = true;

        if(result.text === product.code || result.text === product.mpn){
  
            
          }
      }


    }else{

      setData("Sin datos");

    } 

  }

  const save_picking = async (event) => {

    event.currentTarget.disabled = true;

    const formData = new FormData();
    formData.append('order_id', product.order_code);
    formData.append('product_id', product.id);
    formData.append('quantity', value);
    formData.append('total', product.quantity);


    await axios.post(`http://127.0.0.1:5000/api/picking/save_picking`, formData).then(({data})=>{

       console.log(data);

       if(data) updatePickingTable();

       getOrderDetails();


    })

  }

  const validate_code = (event) => {

    console.log(event.target.value);

    if(event.target.value === product.code || event.target.value === product.mpn){

      if(count<product.quantity){
        quantityRef.current.disabled = true;

          count++;
          console.log("Scanneado: "+count);
          setValue(count);
          setManualCode("");
          quantityRef.current.disabled = false;
          
      }

      setOrderCodeValidation(1);

    }else{
          
          quantityRef.current.disabled = true;

    }

  }

  const updatePickingTable = async () => {
    
    await axios.get(`http://127.0.0.1:5000/api/picking/picking_info/`+reference+`/`+sku).then(({data})=>{

       console.log(data);
       setPicking(data);

    })

  }

  const incrementQuantity = () => {


    if(count<product.quantity){

        count++;
        console.log("Scanneado: "+count);
        setValue(count);
        quantityRef.current.disabled = false;

          
    }else{

      quantityRef.current.disabled = true;

    }

    if(value>0 && product && product.quantity>0){

        
      if(orderCodeValidation ){
        
        buttonRef.current.disabled = false;

      }

    }


  }

  const decreaseQuantity = () => {


    if(count>0){

        count--;
        console.log("Scanneado: "+count);
        setValue(count);
        quantityRef.current.disabled = false;

          
    }else{

      quantityRef.current.disabled = true;

    }

    if(value>0 && product && product.quantity>0){

        
      if(orderCodeValidation ){
        
        buttonRef.current.disabled = false;

      }

    }


  }


  return (
    <Flex direction="column" pt={{ base: "60px", md: "50px" }}>
              <Flex style={{
                    alignItems: 'center',
                    justifyContent: 'start',
                }}>

          <NavLink to={'/admin/pedidos/'+ reference}>
            <Button mt="30px">Volver</Button>
          </NavLink>


        </Flex>
      <Card overflowX={{ sm: "scroll", xl: "hidden" }} mt="30px" style={{height: '100%'}} border={product && !product.quantity? "2px solid green":"unset"} bg="white" >
        <CardHeader p="6px 0px 22px 0px">

        <Flex flexdirection="column" pt={{ base: "20px", md: "15px" }}>
          <SimpleGrid columns={{ sm: 1, md: 2, xl: 2 }} spacing="24px">
            <Text fontSize="xl" color={textColor} fontWeight="bold">
              PEDIDO #{reference}
            </Text>
            <Spacer />
            <Text fontSize="xl" color={textColor} fontWeight="bold">
             PRODUCTO: {product && (
                
                product.title
                
                )}
            </Text>
            <Spacer />
            <Text fontSize="xl" color={textColor} fontWeight="bold">
             CÓDIGO: {product && (
                
                product.code
                
                )}
            </Text>
            <Spacer />
            <Text fontSize="xl" color={textColor} fontWeight="bold">
             CANTIDAD: {product && (
                
                product.quantity
                
                )}
            </Text>
            <Spacer />

            <Text fontSize="xl" color={textColor} fontWeight="bold">
              IMAGEN:
              
              <Spacer></Spacer> 
              
              {product && (
                  
                  <img src={product.images} />
                  
                  )}
            </Text>

            <Spacer />

            </SimpleGrid>

            <SimpleGrid columns={{ sm: 1, md: 2, xl: 2 }} spacing="24px">
            {showScanner == 1 && (
              <div>
              <BarcodeScannerComponent width={500} height={500} onUpdate={(err, result) => scan(result)}/>
              <Spacer />
              <p>{data}</p>           
              </div>

              )}

            </SimpleGrid>
          </Flex>
        </CardHeader>
        <CardBody>

        <Flex
            pe={{ sm: "0px", md: "16px" }}
            w={{ sm: "100%", md: "auto" }}
            alignItems="center"
            flexDirection="row"
          >
            <Text fontSize="xl" pr="20px" color={textColor} fontWeight="bold">
              CANTIDAD
            </Text>
             {product && ( 
             <Flex>

             <InputGroup
              cursor="pointer"
              bg={inputBg}
              borderRadius="15px"
              w={{
                sm: "125px",
                md: "200px",
              }}
              me={{ sm: "auto", md: "20px" }}
              _focus={{
                borderColor: { mainTeal },
              }}
              _active={{
                borderColor: { mainTeal },
              }}
            >
              
              <Input
                fontSize="xs"
                py="11px"
                type="number"
                placeholder="Cantidad..."
                value={value}
                bg={product.quantity === value ? "green.200" : "gray.100"}
                max={product.quantity}
                borderRadius="inherit"

              />
                <InputLeftElement
                  children={
                    <IconButton
                      bg="inherit"
                      borderRadius="inherit"
                      _hover="none"
                      _active={{
                        bg: "inherit",
                        transform: "none",
                        borderColor: "transparent",
                      }}
                      _focus={{
                        boxShadow: "none",
                      }}
                      icon={<AddIcon color="black" w="15px" h="15px" />}
                      onClick={incrementQuantity}
                      ref={quantityRef}
                      
                    ></IconButton>
                  }
                />
                <InputRightElement
                  children={
                    <IconButton
                      bg="inherit"
                      borderRadius="inherit"
                      _hover="none"
                      _active={{
                        bg: "inherit",
                        transform: "none",
                        borderColor: "transparent",
                      }}
                      _focus={{
                        boxShadow: "none",
                      }}
                      icon={<MinusIcon color="black" w="15px" h="15px" />}
                      onClick={decreaseQuantity}
                      ref={quantityRef}
                      
                    ></IconButton>
                  }
                />
            </InputGroup>

            <InputGroup
                cursor="pointer"
                bg={inputBg}
                borderRadius="15px"
                w={{
                  sm: "125px",
                  md: "200px",
                }}
                me={{ sm: "auto", md: "20px" }}
                _focus={{
                  borderColor: { mainTeal },
                }}
                _active={{
                  borderColor: { mainTeal },
                }}
              >
                <Input
                  fontSize="xs"
                  py="11px"
                  ml="10px"
                  pl="10px"
                  type="text"
                  defaultValue=''
                  placeholder="Codigo..."
                  borderRadius="inherit"
                  onChange={validate_code} 
                />   

              </InputGroup>
            </Flex>
             )}
          
          </Flex>

          <Spacer></Spacer>

          <Flex style={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    heigth: '100vh'
                }}>

            {product && product.quantity>0 && (
                            <Button m="15px 0" onClick={show_scanner}>Escanear</Button>

            )}

        </Flex>
        </CardBody>

        <Flex style={{
                    alignItems: 'center',
                    justifyContent: 'start',
                }}>

                
                {value>0 && orderCodeValidation >0 && product && product.quantity>0 && (

                <Button m="35px 0" ref={buttonRef} onClick={save_picking}>Guardar</Button>

                )}

        </Flex>



      </Card>
      <Spacer></Spacer>
      { picking && picking.length > 0 &&
      <Card bg="gray.100" mt="30px" overflowX={{ sm: "scroll", xl: "hidden" }}>
        <CardHeader p="6px 0px 22px 0px">
          <Text fontSize="xl" color={textColor} fontWeight="bold">
            Picking
          </Text>
        </CardHeader>
        <CardBody>
          <Table variant="simple" color={textColor}>
            <Thead>
              <Tr my=".8rem" pl="0px" color="gray.400">
                <Th pl="0px" color="gray.400">
                  Codigo
                </Th>
                <Th color="gray.400">Cantidad</Th>
                <Th color="gray.400">Fecha</Th>
              </Tr>
            </Thead>
            <Tbody>

                
            {
                  picking && picking.length > 0 && (
                    picking.map((row, key)=>(

                        <Tr key={key}>
                              <Td>
                                <Flex direction="column">
                                  <Text fontSize="md" color={textColor} fontWeight="bold">
                                    {row.product_code}
                                  </Text>
                                </Flex>
                              </Td>

                              <Td>
                              <Badge
                                bg={status === "1" ? "green.400" : bgStatus}
                                color={status === "1" ? "white" : colorStatus}
                                fontSize="16px"
                                p="3px 10px"
                                borderRadius="8px"
                              >
                                {row.quantity}
                              </Badge>
                            </Td>


                            <Td>
                                <Flex direction="column">
                                  <Text fontSize="md" color={textColor} fontWeight="bold">
                                  {row.updated_at}
                                  </Text>
                                </Flex>
                              </Td>
                        </Tr>
                      ))
                  )
              }
               
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    }
    </Flex>
  );
}

export default PickingPanel;
