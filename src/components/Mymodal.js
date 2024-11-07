function Mymodal(props) {
    return (
        <>
            <div className="modal fade" tabIndex="-1" id={props.id}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{props.title}</h5>
                            <button 
                                id={`${props.id}_btnClose`} 
                                type="button" 
                                className="close" 
                                data-dismiss="modal" 
                                aria-label="Close"
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>{props.children}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Mymodal;
