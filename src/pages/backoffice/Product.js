import { useEffect, useRef,useState } from "react";
import BackOffice from "../../components/Backoffice";
import Mymodal from "../../components/Mymodal";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../../config";

function Product() {
    const [product, setProduct] = useState({});
    const [products, setProducts] = useState([]);
    const [img, setImg] = useState({});
    const [fileExcel, setFileExcel] = useState({});
    const  refImg = useRef();
    const refExcel = useRef();

    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        try {
            const res = await axios.get(config.apiPath + '/product/list', config.headers());
            if (res.data.results !== undefined) {
                setProducts(res.data.results);
            }
        } catch (e) {
            Swal.fire({
                title: "error",
                text: e.message,
                icon: 'error'
            })

        }
    }
    const handleupload = async () => {
        try {
            const formData = new FormData();
            formData.append('img', img);

            const res = await axios.post(config.apiPath + '/product/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': localStorage.getItem('token')
                }
            })
            if (res.data.newName !== undefined) {
                return res.data.newName;
            }
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }
    const handleSave = async () => {
        try {

            product.img = await handleupload();
            product.price = parseInt(product.price);
            product.cost = parseInt(product.cost);
            let res;
            if (product.id === undefined) {
                res = await axios.post(config.apiPath + '/product/create', product, config.headers());
            } else {
                res = await axios.put(config.apiPath + '/product/update', product, config.headers());
            }


            if (res.data.message === 'success') {
                Swal.fire({
                    title: 'save',
                    text: 'success',
                    icon: 'success',
                    timer: 2000

                })
                document.getElementById('modalProduct_btnClose').click();
                fetchData();
                setProduct({ ...product, id: undefined });
            }
        } catch (e) {
            Swal.fire({
                title: "error",
                text: e.message,
                icon: 'error'
            })
        }
    }

    const clearForm = () => {
        setProduct({
            name: '',
            price: '',
            cost: ''
        })
       
    }

    const handleRemove = async (item) => {
        try {
            const button = await Swal.fire({
                text: 'Remove item',
                title: 'Remove',
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true
            })
            if (button.isConfirmed) {
                const res = await axios.delete(config.apiPath + '/product/remove/' + item.id, config.headers());

                if (res.data.message === 'success') {
                    Swal.fire({
                        title: 'remove',
                        text: 'remove success',
                        icon: 'success',
                        timer: 1000
                    })
                    fetchData();
                }
            }
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }
    const selectedFile = (inputFile) => {
        if (inputFile !== undefined) {
            if (inputFile.length > 0) {
                setImg(inputFile[0]);
            }
        }
    }
    function showImage(item) {
        if (item.img !== "") {
            return <img className="img-fluid" alt="" src={config.apiPath + '/uploads/' + item.img}  />
        }
        return <></>;
    }
    const selectedFileExcel = (fileInput) => {
        if (fileInput !== undefined) {
            if (fileInput.length > 0) {
                setFileExcel(fileInput[0]);
            }
        }
    }
    const handleUploadExcel = async () => {
        try {
            const formData = new FormData();
            formData.append('fileExcel',fileExcel);
            const res = await axios.post(config.apiPath + '/product/uploadFormExcel', formData,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': localStorage.getItem('token')
                }
            });

            if (res.data.message === 'success'){
                Swal.fire({
                    title: 'upload file',
                    text: "upload success",
                    icon: 'success',
                    timer: 1500
                });
                fetchData();

                document.getElementById('modalExcel_btnClose').click();
            }
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }
    const clearFormExcel = () => {
        refExcel.current.value = '';
        setFileExcel(null);
    }


    return <BackOffice>
        <div className="h4"> Product</div>
        <button onClick={clearForm} className="btn btn-primary mr-2" data-toggle="modal" data-target="#modalProduct">
            <i className="fa fa-plus "></i> เพิ่มรายการ
        </button>
        <button onClick={clearFormExcel} className="btn btn-success mr-2 " data-toggle='modal' data-target='#modalExcel'>
            <i className="fa fa-arrow-down "></i> Import from Excel
        </button>
        <table className="mt-3 table table-bordered table-striped">
            <thead>
                <tr>
                    <th>image</th>
                    <th>name</th>
                    <th>cost</th>
                    <th>price</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {products.length > 0 ? products.map(item =>
                    <tr key={item.id}>
                        <td>
                            {item.img && (
                                <img
                                    className="img-fluid"
                                    style={{ width: '100px', height: 'auto' }}
                                    src={config.apiPath + '/uploads/' + item.img}
                                    alt="Img"
                                />
                            )}
                        </td>


                        <td>{item.name}</td>
                        <td>{item.cost}</td>
                        <td>{item.price}</td>
                        <td>
                            <button className="btn btn-sm btn-primary mr-2  " data-toggle="modal" data-target="#modalProduct" onClick={e => setProduct(item)}><i className="fa fa-edit"  ></i> Edit</button>
                            <button className="btn btn-sm btn-danger" onClick={e => handleRemove(item)}><i className="fa fa-times"></i> Remove</button>
                        </td>
                    </tr>
                ) : <></>}
            </tbody>
        </table>
        <Mymodal id="modalProduct" title='สินค้า'>
            <div>
                <div>ชื่อสินค้า</div>
                <input value={product.name} className="form-control" onChange={e => setProduct({ ...product, name: e.target.value })} />

            </div>
            <div className="mt-3">
                <div>ราคาทุน</div>
                <input value={product.cost} className="form-control" onChange={e => setProduct({ ...product, cost: e.target.value })} />
            </div>
            <div className="mt-3">
                <div>ราคาขาย</div>
                <input value={product.price} className="form-control" onChange={e => setProduct({ ...product, price: e.target.value })} />
            </div>
            <div className="mt-3">
                <div    style={{ width: '100px', height: 'auto' }}>{showImage(product)}</div>
                <div>ภาพสินค้า</div>
            <input className="form-control" type="file" ref={refImg} onChange={e => selectedFile(e.target.files)} />
            </div>
            <div className="mt-3">
                <button className="btn btn-primary" onClick={handleSave}>
                    <i className="fa fa-check me-2"></i> Save

                </button>
            </div>
        </Mymodal>

        <Mymodal id='modalExcel' title = 'เลือกไฟล์'>
                <div>เลือกไฟล์</div>
                <input type="file" className="form-control" ref={refExcel} onChange={e => selectedFileExcel(e.target.files)} />
                <button className="mt-3 btn btn-primary" onClick={handleUploadExcel}>
                    <i className="fa fa-check mr-2"></i> Save
                </button>
        </Mymodal>
    </BackOffice>
}
export default Product;