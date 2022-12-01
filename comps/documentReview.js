const DocumentReview = ({ dataToBroadcast = [] }) => {
    return (
        <>
            {dataToBroadcast?.length > 0 && (
                <>
                    <h3>Documents To Be Signed</h3>
                    {dataToBroadcast.map((document, index) => (
                        <p className={'fileLine'} key={index}>
                            {document.fileName} {document.hash}
                        </p>
                    ))}
                </>
            )}
        </>
    )
}

export default DocumentReview
