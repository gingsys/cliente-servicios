import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const Clientes = () => {

    const baseUrl = "http://api.pyrmultimediasac.com/api/clientes";
    const distUrl = "http://api.pyrmultimediasac.com/api/distritos/listarDistritos";
    const [clientes, setClientes] = useState([]);
    const [distritos, setDistritos] = useState([]);
    const [modalInsertar, setModalInsertar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [modalEliminar, setModalEliminar] = useState(false);
    const [clienteSeleccionado, setClienteSeleccionado] = useState({
        cod_cli: "",
        nom_cli: "",
        dni_ruc: "",
        telf_cli: "",
        cod_dis: "",
        nom_dis: "",
        dir_cli: "",
        email: ""
    })


    const abrirCerrarModalInsertar = () => {
        setModalInsertar(!modalInsertar);
    }
    const abrirCerrarModalEditar = () => {
        setModalEditar(!modalEditar);
    }
    const abrirCerrarModalEliminar = () => {
        setModalEliminar(!modalEliminar);
    }

    const handleChange = e => {
        const { name, value } = e.target;
        setClienteSeleccionado({
            ...clienteSeleccionado,
            [name]: value
        });
        console.log(clienteSeleccionado);
    }

    const peticionGet = async () => {
        await axios.get(baseUrl+"/listarClientes")
            .then(response => {
                setClientes(response.data);
            }).catch(error => {
                console.log(error);
            })
    }

    const distritosGet = async () => {
        await axios.get(distUrl)
            .then(response => {
                setDistritos(response.data);
            }).catch(error => {
                console.log(error);
            })
    }

    const peticionPost = async () => {
        delete clienteSeleccionado.cod_cli;
        await axios.post(baseUrl+"/registrarCliente", clienteSeleccionado)
            .then(response => {
                setClientes(clientes.concat(response.data));
                peticionGet();
                abrirCerrarModalInsertar();
            }).catch(error => {
                console.log(error);
            })
    }

    const peticionPut = async () => {
        delete clienteSeleccionado.eliminado;
        delete clienteSeleccionado.nom_dis
        await axios.put(baseUrl + "/actualizarCliente", clienteSeleccionado)
            .then(response => {
                var respuesta = response.data;
                var dataAuxiliar = clientes;
                dataAuxiliar.map(cliente => {
                    if (cliente.cod_cli === clienteSeleccionado.cod_cli) {
                        cliente.cod_cli = respuesta.cod_Cli;
                        cliente.nom_cli = respuesta.nom_cli;
                        cliente.dni_ruc = respuesta.dni_ruc;
                        cliente.telf_cli = respuesta.telf_cli;
                        cliente.cod_dis = respuesta.cod_dis;
                        cliente.dir_cli = respuesta.dir_cli;
                        cliente.email = respuesta.email;
                    }
                })
                peticionGet();
                abrirCerrarModalEditar();
            }).catch(error => {
                console.log(error);
            })
    }

    const peticionDelete = async () => {
        await axios.post(baseUrl + "/eliminarCliente",clienteSeleccionado)
        .then(response => {
            var respuesta = response.data;
            var dataAuxiliar = clientes;
            dataAuxiliar.map(cliente => {
                if (cliente.codCli === clienteSeleccionado.cod_cli) {
                    cliente.cod = respuesta.cod_Cli;
                }
            })
                peticionGet();
                abrirCerrarModalEliminar();
            }).catch(error => {
                console.log(error);
            })
    }

    const seleccionarCliente = (cliente, caso) => {
        setClienteSeleccionado(cliente);
        (caso === "Editar") ?
            abrirCerrarModalEditar() : abrirCerrarModalEliminar();
    }

    useEffect(() => {
        peticionGet();
    }, [])

    useEffect(() => {
        distritosGet();
    }, [])

    return (
        <div>
            <div class="card">
                <div class="card-body">
                    <h5 className="card-title">Lista de Clientes</h5>
                    <hr />
                    <nav class="navbar navbar-expand-lg navbar-light bg-light">
                        <div class="collapse navbar-collapse" id="navbarSupportedContent">
                            <button type="button" className="btn btn-primary" onClick={() => abrirCerrarModalInsertar()}>Registrar Cliente</button>
                            <ul class="navbar-nav mr-auto"></ul>
                        </div>
                    </nav>
                    <hr />
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Dni/RUC</th>
                                <th>Teléfono</th>
                                <th>Distrito</th>
                                <th>Dirección</th>
                                <th>Correo</th>
                                <th>Actualizar</th>
                                <th>Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.map(clientes => (
                                <tr key={clientes.cod_cli}>
                                    <td>{clientes.nom_cli}</td>
                                    <td>{clientes.dni_ruc}</td>
                                    <td>{clientes.telf_cli}</td>
                                    <td>{clientes.nom_dis}</td>
                                    <td>{clientes.dir_cli}</td>
                                    <td>{clientes.email}</td>
                                    <td>
                                        <button className="btn btn-primary" onClick={() => seleccionarCliente(clientes, "Editar")}>Actualizar</button>
                                    </td>
                                    <td>
                                        <button className="btn btn-danger" onClick={() => seleccionarCliente(clientes, "Eliminar")}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal isOpen={modalInsertar}>
                <ModalHeader>Añadir Cliente</ModalHeader>
                <ModalBody>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="nom_cli" className="form-label">Nombre</label>
                            <input type="text" className="form-control" id="nom_cli" name="nom_cli" onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="dni_ruc" className="form-label">DNI/RUC</label>
                            <input type="text" className="form-control" id="dni_ruc" name="dni_ruc" onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="telf_cli" className="form-label">Teléfono</label>
                            <input type="text" className="form-control" id="telf_cli" name="telf_cli" onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="cod_dis" className="form-label">Distrito</label>
                            <select className="form-control" id="cod_dis" name="cod_dis" onChange={handleChange}>
                                <option value="0">Seleccione</option>
                                {distritos.map(distritos => (
                                    <option key={distritos.cod_dis} value={distritos.cod_dis}>{distritos.nom_dis}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="dir_cli" className="form-label">Dirección</label>
                            <input type="text" className="form-control" id="dir_cli" name="dir_cli" onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Correo</label>
                            <input type="text" className="form-control" id="email" name="email" onChange={handleChange} />
                        </div>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-primary" onClick={() => peticionPost()} >Añadir</button>{"   "}
                    <button className="btn btn-danger" onClick={() => abrirCerrarModalInsertar()}>Cancelar</button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalEditar}>
                <ModalHeader>Editar Cliente</ModalHeader>
                <ModalBody>
                    <form>
                        <div className="mb-3" hidden>
                            <label htmlFor="cod_Cli" className="form-label">Código</label>
                            <input type="text" className="form-control" id="cod_cli" name="cod_cli" readOnly value={clienteSeleccionado && clienteSeleccionado.cod_cli} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="nom_cli" className="form-label">Nombre</label>
                            <input type="text" className="form-control" id="nom_cli" name="nom_cli" onChange={handleChange} value={clienteSeleccionado && clienteSeleccionado.nom_cli} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="dni_ruc" className="form-label">DNI/RUC</label>
                            <input type="text" className="form-control" id="dni_ruc" name="dni_ruc" onChange={handleChange} value={clienteSeleccionado && clienteSeleccionado.dni_ruc} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="telf_cli" className="form-label">Teléfono</label>
                            <input type="text" className="form-control" id="telf_cli" name="telf_cli" onChange={handleChange} value={clienteSeleccionado && clienteSeleccionado.telf_cli} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="cod_dis" className="form-label">Distrito</label>
                            <select className="form-control" id="cod_dis" name="cod_dis" onChange={handleChange} value={clienteSeleccionado && clienteSeleccionado.cod_dis} >
                                {distritos.map(distritos => (
                                    <option key={distritos.cod_dis} value={distritos.cod_dis}>{distritos.nom_dis}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="dir_cli" className="form-label">Dirección</label>
                            <input type="text" className="form-control" id="dir_cli" name="dir_cli" onChange={handleChange} value={clienteSeleccionado && clienteSeleccionado.dir_cli} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Correo</label>
                            <input type="text" className="form-control" id="email" name="email" onChange={handleChange} value={clienteSeleccionado && clienteSeleccionado.email} />
                        </div>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-primary" onClick={() => peticionPut()} >Editar</button>{"   "}
                    <button className="btn btn-danger" onClick={() => abrirCerrarModalEditar()}>Cancelar</button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalEliminar}>
                <ModalBody>
                    Estás seguro que deseas eliminar al Cliente {clienteSeleccionado && clienteSeleccionado.nom_cli}?
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-danger" onClick={() => peticionDelete()}>Sí</button>
                    <button className="btn btn-secondary" onClick={() => abrirCerrarModalEliminar()}>No</button>
                </ModalFooter>
            </Modal>
        </div>
    )
}

export default Clientes