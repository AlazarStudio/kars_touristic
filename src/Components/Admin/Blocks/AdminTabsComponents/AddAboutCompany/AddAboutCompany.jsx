import React, { useEffect, useState } from "react";
import classes from './AddAboutCompany.module.css';
import Form from "../../Form/Form";

import server from '../../../../../serverConfig';

function AddAboutCompany({ children, activeTab, ...props }) {
    const [companyInfo, setCompanyInfo] = useState("");

    useEffect(() => {
        async function fetchCompanyInfo() {
            try {
                const response = await fetch(`${server}/api/aboutCompany`);
                const data = await response.json();
                setCompanyInfo(data.aboutCompany);
            } catch (error) {
                console.error("Error fetching company info:", error);
            }
        }

        fetchCompanyInfo();
    }, []);

    async function handleFormSuccess() {
        try {
            const response = await fetch(`${server}/api/aboutCompany`);
            const data = await response.json();
            setCompanyInfo(data.aboutCompany);
        } catch (error) {
            console.error("Error fetching company info after form submission:", error);
        }
    }

    return (
        <div className={classes.addData}>
            <div className={classes.addData_title}>О компании</div>
            
            {companyInfo && (
                <div className={classes.companyInfo}>
                    <h3>Текущее описание компании:</h3>
                    <p>{companyInfo}</p>
                </div>
            )}

            <Form actionUrl={`${server}/api/aboutCompany`} method="put" type={'query'} onSuccess={handleFormSuccess}>
                <label>Добавить краткое описание компании</label>
                <textarea name="aboutCompany" placeholder="Описание" required />

                <button type="submit">Добавить описание компании</button>
            </Form>
        </div>
    );
}

export default AddAboutCompany;
