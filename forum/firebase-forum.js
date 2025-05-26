using UnityEngine;

public class CameraDetection : MonoBehaviour
{
    [SerializeField, Range(0.0f, 1.0f)] private float angleThreshold = 0.5f; // Açı eşik değeri
    [SerializeField, Range(0.0f, 1.0f)] private float topLimit = 0.1f;      // Üst sınırın yüzde cinsinden değeri
    [SerializeField, Range(0.0f, 1.0f)] private float bottomLimit = 0.1f;   // Alt sınırın yüzde cinsinden değeri
    [SerializeField, Range(0.0f, 1.0f)] private float rightLimit = 0.1f;    // Sağ sınırın yüzde cinsinden değeri
    [SerializeField, Range(0.0f, 1.0f)] private float leftLimit = 0.1f;     // Sol sınırın yüzde cinsinden değeri

    internal bool ObjectInCameraDirection(Transform searchObject)
    {
        // Kamera ve nesne arasındaki vektörü al
        Vector3 toObject = searchObject.position - GameManager.Camera.transform.position;

        // Kamera vektörünü normalleştir
        Vector3 cameraDirection = GameManager.Camera.transform.forward.normalized;

        // Vektörleri normalleştir
        toObject.Normalize();

        // Vektörler arasındaki açıyı kontrol et
        float angle = Vector3.Dot(cameraDirection, toObject);

        // Üst, alt, sağ ve sol sınırları belirle
        float topLimitAngle = Mathf.Acos(topLimit);
        float bottomLimitAngle = Mathf.Acos(bottomLimit);
        float rightLimitAngle = Mathf.Acos(rightLimit);
        float leftLimitAngle = Mathf.Acos(leftLimit);

        // Nesnenin açısı üst, alt, sağ ve sol sınırlar içinde mi kontrol et
        bool isInLimits = angle > topLimitAngle && angle < bottomLimitAngle &&
                          Mathf.Abs(Vector3.Dot(toObject, Vector3.right)) > leftLimitAngle &&
                          Mathf.Abs(Vector3.Dot(toObject, Vector3.right)) < rightLimitAngle;

        return isInLimits;
    }
}
