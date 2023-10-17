import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
} from "@chakra-ui/react";

import { NavLink } from "react-router-dom";


// Custom components
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import axios from 'axios';
import { COUNTER_STYLE } from "stylis";


function OrderDetails() {

  const textColor = useColorModeValue("gray.700", "white");
  const bgStatus = useColorModeValue("gray.400", "#1a202c");
  const colorStatus = useColorModeValue("white", "gray.400");
  const [order, setOrder] = useState();
  const [products, setProducts] = useState([]);


  const  { reference } = useParams();

  console.log(reference);


  useEffect(() => {
    getOrderDetails();
   }, []);


  const getOrderDetails = async () => {
    await axios.get(`http://127.0.0.1:5000/api/orders/`+reference).then(({data})=>{

      console.log(data);
       setOrder(data.order);
       setProducts(data.products);

    })

  } 


  return (
    <Flex direction="column" pt={{ base: "60px", md: "50px" }}>
      <Card overflowX={{ sm: "scroll", xl: "hidden" }}>
        <CardHeader p="6px 0px 22px 0px">
        <Flex flexdirection="column" pt={{ base: "120px", md: "75px" }}>
          <SimpleGrid columns={{ sm: 1, md: 2, xl: 2 }} spacing="24px">
            <Text fontSize="xl" color={textColor} fontWeight="bold">
              Pedido {reference}
              <Spacer />
            </Text>
            </SimpleGrid>
          </Flex>
        </CardHeader>
        <CardBody>
          <Table variant="simple" color={textColor}>
            <Thead>
              <Tr my=".8rem" pl="0px" color="gray.400">
                <Th pl="0px" color="gray.400">
                  Codigo
                </Th>
                <Th color="gray.400">Nombre</Th>
                <Th color="gray.400">Cantidad</Th>
                <Th color="gray.400"></Th>
              </Tr>
            </Thead>
            <Tbody>
                {
                  products && products.length > 0 && (
                    products.map((row, key)=>(

                        <Tr key={key} bg={!row.quantity? "green.200": "white"} >
                              <Td>
                                <Flex direction="column">
                                  <Text fontSize="md" color={textColor} fontWeight="bold">
                                    {row.code}
                                  </Text>
                                </Flex>
                              </Td>

                              <Td>
                                <Flex direction="column">
                                  <Text fontSize="md" color={textColor} fontWeight="bold">
                                    {row.title}
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
                                  {row.date_add}
                                  </Text>
                                </Flex>
                              </Td>

                              <Td>
                                <NavLink to={'/admin/picking/'+ reference+'/'+row.code}>
                                  {row.quantity>0 && (

                                  <Button>
                                  <Text  fontSize="md" fontWeight="bold" cursor="pointer">Iniciar Picking</Text>
                                  </Button>

                                  )}

                                  {row.quantity == 0 && (
                                  <Button bg="white">

                                  <Text  fontSize="md" fontWeight="bold" cursor="pointer">Ver detalles</Text>

                                  </Button>

                                  )}
                                </NavLink>
                              </Td>
                        </Tr>
                      ))
                  )
              }
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </Flex>
  );
}

export default OrderDetails;
